import { AUTH_USER_DATA_LS_ITEM } from "../constants/authentication";
import { EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, Store } from "../store";
import {setAuthUser} from '../store/authentication/slice'
let store: Store;

export const BASE_URL = process.env.REACT_APP_BASE_URL;

const baseClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const injectStore = (_store: EnhancedStore<RootState>) =>
  (store = _store);

baseClient.interceptors.response.use((response) => {
   return response;
}, error => {
  if( error.response.status === 401) {
    return baseClient
    .post("/auth/login/refresh", {
      token: JSON.parse(localStorage.getItem(AUTH_USER_DATA_LS_ITEM) as string).data.refreshToken,
    })
    .then(async ({ data }) => {
      await store.dispatch(setAuthUser(data))
      localStorage.setItem(AUTH_USER_DATA_LS_ITEM, JSON.stringify(data))
      return baseClient(error.config);
    }).catch((err) => {
      console.log('err refresh', err)
    });
  }else{
    return Promise.reject(error)
  }
});

baseClient.interceptors.request.use((config: any) => {
  const token = store.getState().authentication.authUser?.data.accessToken;
  config.headers.Authorization = "Bearer "+token;
  return config;
})

export default baseClient;
