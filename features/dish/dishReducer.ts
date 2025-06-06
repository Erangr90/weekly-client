import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import { createNewDish } from "./dishActions";

export interface dishState {
  loading: boolean;
  error?: ServerError;
}

const initialState: dishState = {
  loading: false,
  error: undefined,
};

export const dishSlice = createSlice({
  name: "dish",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Create a new Dish ---
    builder.addCase(createNewDish.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(createNewDish.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(createNewDish.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default dishSlice.reducer;
