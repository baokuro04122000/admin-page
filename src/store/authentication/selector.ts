import { createSelector } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { RootState } from "..";
import { JWTPayload } from "../../interfaces/authentication";

export const selectAuthentication = (state: RootState) => state.authentication;

export const selectIsAuth = createSelector(selectAuthentication, (auth) => {
  const token = auth.authUser?.access_token;
  if (!token) return false;
  const { exp } = jwtDecode<JWTPayload>(token);
  const now = new Date().getTime();
  if (now > exp * 1000) return false;
  return true;
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
