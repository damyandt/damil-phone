import { Query } from "../../callApi";
import { DataForCardLinkStripe } from "../../types/authTypes";

export const getQueryUsersGetCurrentUser = (): Query => ({
  endpoint: "users/current",
  method: "GET",
});

export const getQueryUserTenant = (): Query => ({
  endpoint: "tenants",
  method: "GET",
});

export const postQueryTokenRefresh = (input: any): Query => ({
  endpoint: "auth/refresh_token",
  method: "POST",
  variables: input,
});

export const updateCredentials = (input: any): Query => ({
  endpoint: "api/v1/auth/change-password",
  method: "PUT",
  variables: input,
});

export const getPreferences = (): Query => ({
  endpoint: `settings`,
  method: "GET",
});

export const getGyms = (): Query => ({
  endpoint: "tenants/lookup",
  method: "GET",
});

export const getLink = (data: DataForCardLinkStripe): Query => ({
  endpoint: "stripe/account_link",
  method: "POST",
  variables: data,
});
