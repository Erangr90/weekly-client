import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import { getUsers } from "./usersActions";

export interface usersState {
  loading: boolean;
  error?: ServerError;
}

const initialState: usersState = {
  loading: false,
  error: undefined,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default usersSlice.reducer;
