import baseClient, { BASE_URL } from "./baseClient";
import { AuthApiFactory, ForgotPasswordRequest, UserRegister } from "./openapi-generator";

const authApiFactory = AuthApiFactory(undefined, BASE_URL, baseClient);

export const login = (email: string, password: string) => {
  return authApiFactory.authLoginPost({ email, password });
};
export const logout = () => {
  return authApiFactory.authLogoutGet();
};
export const googleLogin = () => {
  return authApiFactory.apiMeGet()
}
export const register = (user: UserRegister) => {
  return authApiFactory.authRegisterPost(user)
}
export const emailResetPassowrd = (email: string) => {
  return authApiFactory.authEmailResetPasswordPost({email})
}
export const otpResetPassword = (otp: number) => {
  return authApiFactory.authOtpResetPasswordPost({otp})
}
export const newPassword = (token: string, password: string) => {
  return authApiFactory.authResetPasswordPost({token,password})
}