import {  UserCredentialResponse} from "../api/openapi-generator";

export interface AuthenticationSlice {
  authUser: null | UserCredentialResponse;
}

export interface JWTPayload {
  exp: number;
}
