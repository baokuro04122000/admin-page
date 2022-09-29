import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserCredentialResponse,
} from "../../api/openapi-generator";
import { AuthenticationSlice } from "../../interfaces/authentication";

const initialState: AuthenticationSlice = {
  authUser: null,
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<UserCredentialResponse | null>) {
      state.authUser = action.payload;
    }
  },
});

export const { 
  setAuthUser
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
