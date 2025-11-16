import jwtDecode from "jwt-decode";
import { setCookie } from "../Global/Utils/commonFunctions";

import { SetCookieParams } from "../API/types/authTypes";
import { postQueryTokenRefresh } from "../API/queries/auth/apiAuthGetQueries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN } from "../constants/auth";

/**
 * @param navigate React Navigation navigate function
 */
export const handleUserSignOut = async (setAuthedUser?: any) => {
  // await deleteCookie(COOKIE_ACCESS_TOKEN);
  // await deleteCookie(COOKIE_REFRESH_TOKEN);
  // setAuthedUser({ email: "error" });
};

/**
 * Fetch a new access token using the refresh token
 */
type CallApiFn = <T>(params: any, requestIsReMade?: boolean) => Promise<T>;
export const handleFetchUserAccessToken = async (
  refreshToken: string | null,
  callApi: CallApiFn
) => {
  if (!refreshToken) {
    console.warn("No refresh token, user needs to login again");
    return null;
  }

  try {
    const response = await callApi<any>({
      query: postQueryTokenRefresh({ token: refreshToken }),
      auth: null,
      noTokenRequired: true,
    });

    const accessToken: string = response.accessToken;
    if (!accessToken) return null;

    // const decodedToken: DecodedJWTToken = (jwtDecode as any).default(
    //   accessToken
    // );
    // const decodedToken = jwtDecode<DecodedJWTToken>(accessToken);
    const accessCookie: SetCookieParams = {
      name: COOKIE_ACCESS_TOKEN,
      value: accessToken,
      exp: Math.floor(Date.now() / 1000) + 60 * 15,
      sameSite: "strict",
      secure: true,
    };
    await setCookie(accessCookie);

    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return null;
  }
};

export const getFromAsyncStorage = async (itemName: string) => {
  const item = await AsyncStorage.getItem(itemName);
  return item;
};
