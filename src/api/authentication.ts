import baseClient, { BASE_URL } from "./baseClient";
import { AuthApiFactory, DeleteImagesRequest, GoogleLoginRequest, LogoutRequest, OTPRequest, ResetPasswordRequest, SellerRegisterRequest, UserRegister } from "./openapi-generator";

const authApiFactory = AuthApiFactory(undefined, BASE_URL, baseClient);

export const login = (email: string, password: string) => {
  return authApiFactory.authLoginPost({ email, password });
};
export const logout = (logout: LogoutRequest) => {
  return authApiFactory.authLogoutPost(logout);
};
export const googleLogin = (google: GoogleLoginRequest) => {
  return authApiFactory.authOauthGooglePost(google)
}
export const register = (user: UserRegister) => {
  return authApiFactory.authRegisterPost(user)
}
export const emailResetPassowrd = (email: string) => {
  return authApiFactory.authPasswordEmailPost({email})
}
export const otpResetPassword = (otp: OTPRequest) => {
  return authApiFactory.authOtpResetPasswordPost(otp)
}
export const newPassword = (resetPassword: ResetPasswordRequest) => {
  return authApiFactory.authPasswordResetPost(resetPassword)
}
export const checkTokenSellerRegister = (token: string) => {
  return authApiFactory.authTokenCheckGet({token})
}
export const deleteFileList = (fileList:DeleteImagesRequest) => {
  return authApiFactory.authDeleteFilesPost(fileList)
}
export const sellerRegister = (seller:SellerRegisterRequest) => {
  return authApiFactory.authSellerCreatePost(seller)
}

export const sendEmailAgain = (userId: string) => {
  return authApiFactory.authRegisterSendOtpAgainPost({userId})
}
//test API for mobile app
export const registerSellerRequest = () => {
  return authApiFactory.authSellerRegisterRequestGet()
}
