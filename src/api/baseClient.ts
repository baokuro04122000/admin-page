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
  if( error.response.status === 409) {
    return baseClient.get("/auth/refresh-token").then(async ({data}) => {
      localStorage.setItem(AUTH_USER_DATA_LS_ITEM, JSON.stringify(data));
      await store.dispatch(setAuthUser(data))
      return baseClient(error.config)
    })
  }
  return Promise.reject(error)
});

export default baseClient;
