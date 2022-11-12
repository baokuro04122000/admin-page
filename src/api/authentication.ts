import baseClient, { BASE_URL } from "./baseClient";
import { AuthApiFactory, DeleteImagesRequest, OTPRequest, ResetPasswordRequest, SellerRegisterRequest, UserRegister } from "./openapi-generator";

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
export const otpResetPassword = (otp: OTPRequest) => {
  return authApiFactory.authOtpResetPasswordPost(otp)
}
export const newPassword = (resetPassword: ResetPasswordRequest) => {
  return authApiFactory.authResetPasswordPost(resetPassword)
}
export const checkTokenSellerRegister = (token: string) => {
  return authApiFactory.authCheckSellerRegisterRequestPost({token})
}
export const deleteFileList = (fileList:DeleteImagesRequest) => {
  return authApiFactory.authDeleteFilesPost(fileList)
}
export const sellerRegister = (seller:SellerRegisterRequest) => {
  return authApiFactory.authSellerRegisterPost(seller)
}

export const sendEmailAgain = (userId: string) => {
  return authApiFactory.authRegisterSendOtpAgainPost({userId})
}
//test API for mobile app
export const registerSellerRequest = () => {
  return authApiFactory.authSellerRegisterRequestGet()
}
