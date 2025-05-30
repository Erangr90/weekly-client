import { ServerError } from "@/types/errors";
import { Ingredient } from "@/types/ingredient";
import axiosClient from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getAllIngredient = createAsyncThunk<
  Ingredient[],
  void,
  { rejectValue: ServerError }
>("ingredient/getAllIngredient", async (_: void, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/ingredients");
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in getAllIngredient action" });
  }
});

export const addPendingIngr = createAsyncThunk<
  { message: string },
  { name: string },
  { rejectValue: ServerError }
>("ingredient/addPendingIngr", async ({ name }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post("/pending", { name });
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in AddPendingIngr action" });
  }
});

export const getAllPendingLen = createAsyncThunk<
  { len: number },
  void,
  { rejectValue: ServerError }
>("ingredient/getAllPendingLen", async (_: void, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/pending/len");
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in getAllPendingLen action" });
  }
});

export const getAllPending = createAsyncThunk<
  Ingredient[],
  void,
  { rejectValue: ServerError }
>("ingredient/getAllPending", async (_: void, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/pending");
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in getAllPending action" });
  }
});

export const approvePending = createAsyncThunk<
  { message: string },
  { id: number; name: string },
  { rejectValue: ServerError }
>("ingredient/approvePending", async ({ id, name }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post(`/pending/${id}`, { name });
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in approvePending action" });
  }
});

export const deletePending = createAsyncThunk<
  { message: string },
  { id: number },
  { rejectValue: ServerError }
>("ingredient/deletePending", async ({ id }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.delete(`/pending/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in deletePending action" });
  }
});
