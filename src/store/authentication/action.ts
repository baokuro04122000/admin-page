import { AppThunk } from "..";
import { UserCredentialResponse } from "../../api/openapi-generator";
import { AUTH_USER_DATA_LS_ITEM } from "../../constants/authentication";
import { 
  setAuthUser,
  setNotifyResetPassowrd,
  setVerifyToken
} from "./slice";
import { AxiosError } from 'axios'
import { 
  login, 
  googleLogin,
  logout,
  emailResetPassowrd,
  otpResetPassword,
  newPassword
} from "../../api/authentication";


export const actionLogin = (
  email: string,
  password: string
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const { data } = await login(email, password);
      dispatch(setAuthUser(data));
      localStorage.setItem(AUTH_USER_DATA_LS_ITEM, JSON.stringify(data));
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  };
};

export const actionAutoLogin = (): AppThunk => {
  return (dispatch) => {
    const userData = localStorage.getItem(AUTH_USER_DATA_LS_ITEM);
    if (!userData) return;
    const parsedUserData: UserCredentialResponse = JSON.parse(userData);
    dispatch(setAuthUser(parsedUserData));
  };
};

export const actionLogout = (): AppThunk<Promise<boolean>> => {
  return async (dispatch) => {
    try {
      const {data} = await logout()
      localStorage.removeItem(AUTH_USER_DATA_LS_ITEM);
      dispatch(setAuthUser(null))
      console.log(data)
      return true
    } catch (error) {
      console.error("CAN'T LOGOUT");
      console.log(error)
      return false
    }
  };
};

export const actionGoogleLogin = (
): AppThunk<Promise<void>> =>{
  return async (dispatch) => {
    try {
      const { data } =await googleLogin()
      dispatch(setAuthUser(data));
      localStorage.setItem(AUTH_USER_DATA_LS_ITEM, JSON.stringify(data));
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
} 

export const actionEmailResetPassword = (
  email: string
): AppThunk<Promise<void>> =>{
  return async (dispatch) => {
    try {
      const { data } = await emailResetPassowrd(email)
      dispatch(setNotifyResetPassowrd(data.data?.message))
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
} 

export const actionOTPResetPassword = (
  otp: number
): AppThunk<Promise<void>> =>{
  return async (dispatch) => {
    try {
      const { data } = await otpResetPassword(otp)
      dispatch(setVerifyToken(data.data?.token))
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
} 

export const actionNewPassword = (
  token:string,
  password: string
): AppThunk<Promise<void>> =>{
  return async (dispatch) => {
    try {
      const { data } = await newPassword(token, password)
      dispatch(setNotifyResetPassowrd(data.data?.message)) 
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}