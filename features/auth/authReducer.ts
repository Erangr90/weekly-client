import { ServerError } from "@/types/errors";
import { User } from "@/types/users";
import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  logout,
  register,
  resetPassword,
  verifyCode,
  verifyEmail,
} from "./authActions";

export interface AuthState {
  user: User | null;
  isLogin: boolean;
  loading: boolean;
  error?: ServerError;
}

const initialState: AuthState = {
  user: null,
  isLogin: false,
  loading: false,
  error: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(register.fulfilled, (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.user = action.payload.user;
      state.isLogin = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = null;
      state.isLogin = false;
      state.loading = false;
    });
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(verifyCode.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(verifyCode.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(verifyCode.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = null;
      state.isLogin = false;
      state.loading = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.user = action.payload.user;
      state.isLogin = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
      state.user = null;
      state.isLogin = false;
    });
    builder.addCase(login.pending, (state) => {
      state.error = undefined;
      state.user = null;
      state.isLogin = false;
      state.loading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = null;
      state.isLogin = false;
      state.loading = false;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = null;
      state.isLogin = false;
      state.loading = false;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
      state.user = null;
      state.isLogin = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isLogin = true;
      state.error = { message: "Something went wrong" };
    });
    builder.addCase(logout.pending, (state) => {
      state.error = undefined;
      state.user = null;
      state.isLogin = false;
      state.loading = true;
    });
  },
});
export default authSlice.reducer;
