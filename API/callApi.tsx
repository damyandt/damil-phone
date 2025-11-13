import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "../constants/auth";
import {
  handleFetchUserAccessToken,
  handleUserSignOut,
} from "../contexts/authContextUtils";
import { getCookie } from "../Global/Utils/commonFunctions";
import { User } from "./types/authTypes";

export type ResponseError = {
  detail: string;
};

export type Query = {
  endpoint: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  variables?: { [key: string]: any };
  endpointBase?: string;
  receiveErrorMessage?: boolean;
  multipartForm?: boolean;
  returnJson?: boolean;
  multipartCustomKey?: string;
  responseType?: "json" | "blob";
  dontAppendEndpointBase?: boolean;
  triggerDownload?: boolean;
};
export type CallApiParams = {
  query: Query;
  auth: {
    setAuthedUser: React.Dispatch<React.SetStateAction<Partial<User>>>;
  } | null;
};
const API_BASE = "https://fitmanage-b0bb9372ef38.herokuapp.com/api/v1/";

const NO_AUTH_ENDPOINTS = [
  "/tenants/lookup",
  "/access-requests",
  "/auth/login",
  "/auth/register",
];
const shouldSkipToken = (endpoint: string) =>
  NO_AUTH_ENDPOINTS.some((path) => endpoint.includes(path)) ||
  endpoint.startsWith("/auth/") ||
  endpoint.startsWith("/api/v1/auth/");
const callApi = async <T,>(
  params: CallApiParams,
  requestIsReMade: boolean = false
): Promise<T> => {
  const { query, auth } = params;
  const {
    endpoint,
    method,
    variables,
    receiveErrorMessage,
    multipartForm,
    returnJson = true,
    triggerDownload,
    responseType,
  } = query;
  const accessToken = await getCookie(COOKIE_ACCESS_TOKEN);
  console.log(endpoint);
  // If endpoint needs auth and we have no access token, try refreshing first
  if (shouldSkipToken(endpoint) && !accessToken) {
    if (!requestIsReMade && auth) {
      const refreshToken: any = await getCookie(COOKIE_REFRESH_TOKEN);
      const accessToken = await handleFetchUserAccessToken(
        refreshToken,
        callApi
      );
      if (accessToken) {
        // we have fetched and saved the accessToken
        return await callApi({ query, auth }, true);
      } else {
        // accessToken not fetched, log out the user due to invalid
        // or expired refresh token
        handleUserSignOut(auth);
      }
    } else {
      // Already retried or no auth context
      throw new Error("No access token available for authenticated request");
    }
  }

  let fetchOptions: RequestInit = {
    method,
    headers: {
      ...(multipartForm ? {} : { "Content-Type": "application/json" }),
      ...(!shouldSkipToken(endpoint) && accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
    },
    credentials: "include",
  };

  let url = `${API_BASE}${endpoint}`;

  // Handle GET or DELETE with query params
  if ((method === "GET" || method === "DELETE") && variables) {
    const paramsStr = new URLSearchParams(variables).toString();
    url += `?${paramsStr}`;
  }

  // Handle multipart form or JSON body
  if (multipartForm && variables) {
    const formData = new FormData();
    Object.entries(variables).forEach(([key, value]) => {
      if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file) => formData.append(key, file));
      } else {
        formData.append(key, value as any);
      }
    });
    fetchOptions.body = formData;
  } else if (variables && method !== "GET" && method !== "DELETE") {
    fetchOptions.body = JSON.stringify(variables);
  }

  const response = await fetch(url, fetchOptions);

  if (triggerDownload && response.ok) {
    const disposition = response.headers.get("content-disposition");
    const contentType = response.headers.get("content-type");
    if (
      disposition?.includes("attachment") ||
      contentType?.includes("application/pdf") ||
      contentType?.includes("image")
    ) {
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      if (contentType?.includes("application/pdf")) {
        const iframe = document.createElement("iframe");
        iframe.src = fileURL;
        iframe.width = "80%";
        iframe.height = "80%";
        const previewContainer = document.createElement("div");
        previewContainer.style.cssText = `
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0,0,0,0.7);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        `;
        previewContainer.appendChild(iframe);
        document.body.appendChild(previewContainer);
        previewContainer.addEventListener("click", (e) => {
          if (e.target === previewContainer) {
            previewContainer.remove();
            URL.revokeObjectURL(fileURL);
          }
        });
      } else {
        const a = document.createElement("a");
        a.href = fileURL;
        const filenameMatch = disposition?.match(/filename="?(.+?)"?$/);
        a.download = filenameMatch?.[1] || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(fileURL);
      }
      return {} as T;
    }
  }

  // Handle expired token with auth
  if (auth && !requestIsReMade && response.status === 401) {
    const jsonData: { detail: string } = await response.json();
    if (jsonData.detail === "Invalid access token") {
      const refreshToken: any = await getCookie(COOKIE_REFRESH_TOKEN);
      const accessToken = await handleFetchUserAccessToken(
        refreshToken,
        callApi
      );
      if (accessToken) {
        // we have fetched and saved the accessToken
        return await callApi({ query, auth }, true);
      } else {
        // accessToken not fetched, log out the user due to invalid
        // or expired refresh token
        handleUserSignOut(auth);
      }
    }
  }

  if (!response.status.toString().startsWith("2") && !receiveErrorMessage) {
    console.error("API error:", response);
    throw new Error(`API error - ${response.url}`);
  }

  if (responseType === "blob") return (await response.blob()) as T;
  if (returnJson) return (await response.json()) as T;

  return response as unknown as T;
};

export default callApi;
