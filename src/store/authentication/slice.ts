import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserCredentialResponse,
} from "../../api/openapi-generator";
import { AuthenticationSlice } from "../../interfaces/authentication";

const initialState: AuthenticationSlice = {
  authUser: null,
  notifyResetPassowrd: undefined,
  verifyToken: undefined,
  userId: undefined
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<UserCredentialResponse | null>) {
      state.authUser = action.payload;
    },
    setNotifyResetPassowrd(
      state,
      {payload}: PayloadAction<string | undefined>
    ){
      state.notifyResetPassowrd = payload
    },
    setVerifyToken(
      state,
      {payload}: PayloadAction<string | undefined>
    ){
      state.verifyToken = payload
    },
    setUserId(
      state,
      {payload} : PayloadAction<string | undefined>
    ){
      state.userId = payload
    }
  },
});

export const { 
  setAuthUser,
  setNotifyResetPassowrd,
  setVerifyToken,
  setUserId
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
