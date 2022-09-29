import baseClient, { BASE_URL } from "./baseClient";
import { AuthApiFactory } from "./openapi-generator";

const authApiFactory = AuthApiFactory(undefined, BASE_URL, baseClient);

export const login = (email: string, password: string) => {
  return authApiFactory.authLoginPost({ email, password });
};
export const logout = () => {
  return authApiFactory.authLogoutPost();
};
export const googleLogin = () => {
  return authApiFactory.apiMeGet()
}