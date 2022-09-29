import { EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState, Store } from "../store";

let store: Store;

export const BASE_URL = process.env.REACT_APP_BASE_URL;

const baseClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const injectStore = (_store: EnhancedStore<RootState>) =>
  (store = _store);

baseClient.interceptors.request.use(async (config) => {
  const { authUser } = store.getState().authentication;

  if (!authUser?.access_token || !config.headers) return config;

  return config;
});

export default baseClient;
