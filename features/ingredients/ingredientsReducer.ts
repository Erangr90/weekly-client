import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import {
  addPendingIngr,
  approvePending,
  deletePending,
  getAllIngredient,
  getAllPending,
  getAllPendingLen,
} from "./ingredientsActions";

export interface ingredientState {
  loading: boolean;
  error?: ServerError;
}

const initialState: ingredientState = {
  loading: false,
  error: undefined,
};

export const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Get all Ingredients ---
    builder.addCase(getAllIngredient.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getAllIngredient.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllIngredient.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Add  Ingredient for pending ---
    builder.addCase(addPendingIngr.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(addPendingIngr.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(addPendingIngr.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get pending Ingredient length ------
    builder.addCase(getAllPendingLen.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getAllPendingLen.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllPendingLen.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get all pending ---
    builder.addCase(getAllPending.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getAllPending.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllPending.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Approve pending ---
    builder.addCase(approvePending.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(approvePending.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(approvePending.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Delete pending ---
    builder.addCase(deletePending.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(deletePending.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(deletePending.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default ingredientsSlice.reducer;
