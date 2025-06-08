import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import {
  createNewDish,
  getDishById,
  getDishesPage,
  getUserDishes,
  updateDish,
} from "./dishActions";

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
    // --- Get dishes by page ---
    builder.addCase(getDishesPage.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getDishesPage.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getDishesPage.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get dish By Id ---
    builder.addCase(getDishById.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getDishById.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getDishById.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Update Dish ---
    builder.addCase(updateDish.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(updateDish.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(updateDish.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get user Dishes ---
    builder.addCase(getUserDishes.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getUserDishes.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getUserDishes.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default dishSlice.reducer;
