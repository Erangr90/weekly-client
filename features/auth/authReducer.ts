import { ServerError } from "@/types/errors";
import { User } from "@/types/users";
import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUser,
  getAllUsers,
  getUserIngr,
  login,
  logout,
  register,
  resetPassword,
  updateUserAllergy,
  updateUserIng,
  updateUserRole,
  verifyCode,
  verifyEmail,
} from "./authActions";

export interface AuthState {
  user: User | undefined;
  isLogin: boolean;
  loading: boolean;
  error?: ServerError;
}

const initialState: AuthState = {
  user: undefined,
  isLogin: false,
  loading: false,
  error: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Register ---
    builder.addCase(register.fulfilled, (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.user = action.payload.user;
      state.isLogin = true;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = undefined;
      state.isLogin = false;
      state.loading = false;
    });
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    // --- Verify Code ---
    builder.addCase(verifyCode.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    builder.addCase(verifyCode.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    builder.addCase(verifyCode.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = undefined;
      state.isLogin = false;
      state.loading = false;
    });
    // --- Login ---
    builder.addCase(login.fulfilled, (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.user = action.payload.user;
      state.isLogin = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
      state.user = undefined;
      state.isLogin = false;
    });
    builder.addCase(login.pending, (state) => {
      state.error = undefined;
      state.user = undefined;
      state.isLogin = false;
      state.loading = true;
    });
    // --- Verify Email ---
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = undefined;
      state.isLogin = false;
      state.loading = false;
    });
    // --- Reset password ---
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = undefined;
      state.isLogin = false;
      state.user = undefined;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.user = undefined;
      state.isLogin = false;
      state.loading = false;
    });
    // --- Logout ---
    builder.addCase(logout.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
      state.user = undefined;
      state.isLogin = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      state.user = undefined;
      state.isLogin = true;
      state.error = { message: "Something went wrong" };
    });
    builder.addCase(logout.pending, (state) => {
      state.error = undefined;
      state.user = undefined;
      state.isLogin = false;
      state.loading = true;
    });
    // --- Update user's Ingredients ---
    builder.addCase(updateUserIng.fulfilled, (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(updateUserIng.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(updateUserIng.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Update user's Allergies ---
    builder.addCase(updateUserAllergy.fulfilled, (state, action) => {
      state.error = undefined;
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(updateUserAllergy.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(updateUserAllergy.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get All users ---
    builder.addCase(getAllUsers.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Update user's role ---
    builder.addCase(updateUserRole.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(updateUserRole.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Delete User ---
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get user ingr ---
    builder.addCase(getUserIngr.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getUserIngr.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getUserIngr.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default authSlice.reducer;
