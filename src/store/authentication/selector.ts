import { 
  ADMIN_PATH,
  LOGOUT_SUBPATH,
  SELLER_DASHBOARD_PATH,
  SHIPPER_DASHBOARD_PATH,

} from "../../constants/routes";
import { createSelector } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { RootState } from "..";
import { JWTPayload } from "../../interfaces/authentication";

export const selectAuthentication = (state: RootState) => state.authentication;

export const selectIsAuth = createSelector(selectAuthentication, (auth) => {
  const token = auth.authUser?.data.accessToken;
  if (!token) return false;
  const { exp } = jwtDecode<JWTPayload>(token);
  const now = new Date().getTime();
  if (now > exp * 1000) { 
    return false;
  }else{
    return true
  }
});

export const selectIsAdmin = createSelector(selectAuthentication, (auth) => {
  return auth.authUser?.data?.role === "admin";
});

export const selectIsSeller = createSelector(selectAuthentication, (auth) => {
  return auth.authUser?.data?.role === "seller";
});

export const selectIsUser = createSelector(selectAuthentication, (auth) => {
  return auth.authUser?.data?.role === "user";
});

export const selectIsShipper = createSelector(selectAuthentication, (auth) => {
  return auth.authUser?.data?.role === "shipper";
});

export const selectUrlLogout =  createSelector(selectAuthentication, (auth) => {
  const role = auth.authUser?.data?.role
  if(role === 'seller') return SELLER_DASHBOARD_PATH + LOGOUT_SUBPATH
  if(role === 'shipper') return SHIPPER_DASHBOARD_PATH + "/"+LOGOUT_SUBPATH
  if(role === 'admin') return ADMIN_PATH + "/" + LOGOUT_SUBPATH
  return '/logout'
});