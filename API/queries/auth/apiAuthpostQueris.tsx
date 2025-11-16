import { Query } from "../../callApi";

export const postLogin = (input: any): Query => ({
  endpoint: `auth/login`,
  method: "POST",
  variables: input,
  // noTokenRequired: true,
});
