import { Allergy } from "@/types/allergy";
import { ServerError } from "@/types/errors";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllergies } from "./allergyActions";

export interface allergyState {
  loading: boolean;
  error?: ServerError;
  allergies: Allergy[] | null;
}

const initialState: allergyState = {
  loading: false,
  error: undefined,
  allergies: null,
};

export const allergySlice = createSlice({
  name: "allergies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Get all Allergies ---
    builder.addCase(
      getAllergies.fulfilled,
      (state, action: PayloadAction<Allergy[]>) => {
        state.error = undefined;
        state.loading = false;
        state.allergies = action.payload;
      },
    );
    builder.addCase(getAllergies.rejected, (state, action) => {
      state.error = action.payload || { message: "Something went wrong" };
      state.loading = false;
    });
    builder.addCase(getAllergies.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
  },
});
export default allergySlice.reducer;
