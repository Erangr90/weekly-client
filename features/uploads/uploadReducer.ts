import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import { uploadImage } from "./uploadActions";

export interface uploadState {
  loading: boolean;
  error?: ServerError;
}

const initialState: uploadState = {
  loading: false,
  error: undefined,
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Upload an Image ---
    builder.addCase(uploadImage.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(uploadImage.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default uploadSlice.reducer;
