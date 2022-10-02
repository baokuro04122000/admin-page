import {  UserCredentialResponse} from "../api/openapi-generator";

export interface AuthenticationSlice {
  authUser: null | UserCredentialResponse;
  notifyResetPassowrd: string | undefined;
  verifyToken:string | undefined;
}

export interface JWTPayload {
  exp: number;
}
