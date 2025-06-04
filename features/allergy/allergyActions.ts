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

export const getAllergiesPage = createAsyncThunk<
  Allergy[],
  { page: number; search?: string },
  { rejectValue: ServerError }
>(
  "allergies/getAllergiesPage",
  async (
    { page, search }: { page: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      if (search && search !== "") {
        const { data } = await axiosClient.get(`/allergies/page`, {
          params: { page, search },
        });
        return data;
      } else {
        const { data } = await axiosClient.get(`/allergies/page`, {
          params: { page },
        });
        return data;
      }
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in getAllergiesPage action" });
    }
  },
);

export const updateAllergy = createAsyncThunk<
  { message: string },
  { id: number; name: string },
  { rejectValue: ServerError }
>(
  "allergies/updateAllergy",
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/allergies/${id}`, { name });
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in updateAllergy action" });
    }
  },
);

export const createAllergy = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: ServerError }
>("allergies/createAllergy", async (name: string, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post(`/allergies`, { name });
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in createAllergy action" });
  }
});

export const deleteAllergy = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: ServerError }
>("allergies/deleteAllergy", async (id: number, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.delete(`/allergies/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in deleteAllergy action" });
  }
});
