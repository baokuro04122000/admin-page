import {  UserCredentialResponse} from "../api/openapi-generator";

export interface AuthenticationSlice {
  authUser: null | UserCredentialResponse;
  notifyResetPassowrd: string | undefined;
  verifyToken:string | undefined;
  userId: string | undefined;
  socket?: any
}

export interface JWTPayload {
  exp: number;
}

export interface ResponseUploadFile {
  uid: string,
  status: string,
  url: string
}
