import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  userList: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUserList(state, action: PayloadAction<any | null>) {
      state.userList = action.payload;
    }
  },
});

export const { 
  setUserList,
} = adminSlice.actions;

export default adminSlice.reducer;
