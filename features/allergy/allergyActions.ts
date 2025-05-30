import { Allergy } from "@/types/allergy";
import { ServerError } from "@/types/errors";
import axiosClient from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getAllergies = createAsyncThunk<
  Allergy[],
  void,
  { rejectValue: ServerError }
>("allergies/getAll", async (_: void, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/allergies");
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in getAllergies action" });
  }
});
