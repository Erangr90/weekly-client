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
  number,
  { rejectValue: ServerError }
>("ingredient/getAllPending", async (page: number, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/pending", {
      params: { page },
    });
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

export const createIngred = createAsyncThunk<
  { message: string },
  string,
  { rejectValue: ServerError }
>("ingredient/createIngred", async (name: string, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post(`/ingredients`, { name });
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in createIngred action" });
  }
});

export const deleteIngred = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: ServerError }
>("ingredient/deleteIngred", async (id: number, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.delete(`/ingredients/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in deleteIngred action" });
  }
});

export const getAllIngredPage = createAsyncThunk<
  Ingredient[],
  { page: number; search?: string },
  { rejectValue: ServerError }
>(
  "ingredient/getAllIngredPage",
  async (
    { page, search }: { page: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      if (search && search !== "") {
        const { data } = await axiosClient.get(`/ingredients/page`, {
          params: { page, search },
        });
        return data;
      } else {
        const { data } = await axiosClient.get(`/ingredients/page`, {
          params: { page },
        });
        return data;
      }
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in getAllIngredPage action" });
    }
  },
);

export const updateIngred = createAsyncThunk<
  { message: string },
  { id: number; name: string },
  { rejectValue: ServerError }
>(
  "ingredient/updateIngred",
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/ingredients/${id}`, { name });
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in updateIngred action" });
    }
  },
);
