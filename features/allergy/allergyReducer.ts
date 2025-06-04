import { ServerError } from "@/types/errors";
import { createSlice } from "@reduxjs/toolkit";
import {
  createAllergy,
  deleteAllergy,
  getAllergies,
  getAllergiesPage,
  updateAllergy,
} from "./allergyActions";

export interface allergyState {
  loading: boolean;
  error?: ServerError;
}

const initialState: allergyState = {
  loading: false,
  error: undefined,
};

export const allergySlice = createSlice({
  name: "allergies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Get all Allergies ---
    builder.addCase(getAllergies.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getAllergies.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllergies.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Get all Allergies by page ---
    builder.addCase(getAllergiesPage.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(getAllergiesPage.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllergiesPage.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Update Allergy ---
    builder.addCase(updateAllergy.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(updateAllergy.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(updateAllergy.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Create new Allergy ---
    builder.addCase(createAllergy.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(createAllergy.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(createAllergy.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    // --- Delete Allergy ---
    builder.addCase(deleteAllergy.fulfilled, (state) => {
      state.error = undefined;
      state.loading = false;
    });
    builder.addCase(deleteAllergy.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(deleteAllergy.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default allergySlice.reducer;
