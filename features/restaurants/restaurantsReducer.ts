import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantsPage,
  updateRestaurant,
} from "./restaurantsActions";

export interface restaurantState {
  loading: boolean;
  error?: ServerError;
}

const initialState: restaurantState = {
  loading: false,
  error: undefined,
};

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Get all restaurants by page and search ---
    builder.addCase(getRestaurantsPage.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getRestaurantsPage.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getRestaurantsPage.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Update restaurant ---
    builder.addCase(updateRestaurant.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(updateRestaurant.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(updateRestaurant.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Delete restaurant ---
    builder.addCase(deleteRestaurant.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(deleteRestaurant.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(deleteRestaurant.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Create restaurant ---
    builder.addCase(createRestaurant.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(createRestaurant.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(createRestaurant.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default ingredientsSlice.reducer;
