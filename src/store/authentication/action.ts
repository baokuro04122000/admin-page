import { AppThunk } from "..";
import { DeleteImagesRequest, OTPRequest, ResetPasswordRequest, SellerRegisterRequest, UserCredentialResponse } from "../../api/openapi-generator";
import { AUTH_USER_DATA_LS_ITEM } from "../../constants/authentication";
import { 
  setAuthUser,
  setNotifyResetPassowrd,
  setVerifyToken,
  setUserId
} from "./slice";
import axios,{ AxiosError } from 'axios'
import { 
  login, 
  googleLogin,
  logout,
  emailResetPassowrd,
  otpResetPassword,
  newPassword,
  registerSellerRequest,
  checkTokenSellerRegister,
  deleteFileList,
  sellerRegister,
  sendEmailAgain
} from "../../api/authentication";
import { ResponseUploadFile } from '../../interfaces/authentication'
import { RcFile } from "antd/lib/upload";

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
      console.log(error)
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
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
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
      await dispatch(setNotifyResetPassowrd(data.data?.message))
      await dispatch(setUserId(data.userId))
    } catch (error) {
      const err = error as AxiosError
      console.log(err)
      throw err.response?.data;
    }
  }
} 

export const actionOTPResetPassword = (
  otp: OTPRequest
): AppThunk<Promise<void>> =>{
  return async (dispatch) => {
    try {
      const { data } = await otpResetPassword(otp)
      await dispatch(setVerifyToken(data.data?.token))
      await dispatch(setUserId(data.userId))
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
} 

export const actionNewPassword = (
  resetPassword: ResetPasswordRequest
): AppThunk<Promise<void>> =>{
  return async (dispatch) => {
    try {
      const { data } = await newPassword(resetPassword)
      dispatch(setNotifyResetPassowrd(data.data?.message)) 
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionUploadImage = (file: RcFile): AppThunk<Promise<ResponseUploadFile>> => {
  return async () => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      const {data} = await axios({
        method: "post",
        url: "http://localhost:5000/api/upload-image",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(data)
      return data.data
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionUploadProofSeller = (files: RcFile[]): AppThunk<Promise<ResponseUploadFile[]>> => {
  return async () => {
    try {
      const formData = new FormData()
      files.forEach((file: RcFile)=>{
        formData.append("proof", file);
      });
      console.log(files)
      const {data} = await axios({
        method: "post",
        url: "http://localhost:5000/api/upload-proof-seller",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data
      //return [{link:"agsdja",fileId:"dahgsdj"},{link:"agsdja",fileId:"dahgsdj"}]
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionCheckSellerRegister = (token: string)
: AppThunk<Promise<boolean>> => {
  return async () => {
    try {
      await checkTokenSellerRegister(token)
      return true
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionDeleteFileList = (fileList: DeleteImagesRequest)
: AppThunk<Promise<void>> => {
  return async () => {
    try {
      const {data} = await deleteFileList(fileList)
      console.log(data.data)
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionDeleteFileListbySeller = (fileList: string[])
: AppThunk<Promise<void>> => {
  return async () => {
    try {
      const {data} = await axios.post('/upload/delete-file', {fileList})
      console.log(data.data)
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionSellerRegister = (seller: SellerRegisterRequest)
: AppThunk<Promise<string>> => {
  return async () => {
    try {
      const {data} = await sellerRegister(seller)
      return data.data?.message ? data.data?.message : ""
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionSendOtpAgain = (userId: string)
: AppThunk<Promise<string>> => {
  return async () => {
    try {
      const {data} = await sendEmailAgain(userId)
      return data.data?.message ? data.data?.message : "" 
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}
//test API for mobile app

export const actionRegisterSellerRequest = () 
: AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const {data} = await registerSellerRequest();
      return data.data?.message
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}