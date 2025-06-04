import { ServerError } from "@/types/errors";
import { Restaurant } from "@/types/restaurant";
import axiosClient from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getRestaurantsPage = createAsyncThunk<
  Restaurant[],
  { page: number; search?: string },
  { rejectValue: ServerError }
>(
  "restaurant/getAllRestaurantsPage",
  async (
    { page, search }: { page: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      if (search && search !== "") {
        const { data } = await axiosClient.get(`/restaurants/page`, {
          params: { page, search },
        });
        return data;
      } else {
        const { data } = await axiosClient.get(`/restaurants/page`, {
          params: { page },
        });
        return data;
      }
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: "Error in getAllRestaurantsPage action",
      });
    }
  },
);

export const updateRestaurant = createAsyncThunk<
  { message: string },
  Restaurant,
  { rejectValue: ServerError }
>(
  "restaurant/updateRestaurant",
  async (res: Restaurant, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/restaurants/${res.id}`, {
        name: res.name,
        email: res.email,
        phone: res.phone,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: "Error in updateRestaurant action",
      });
    }
  },
);

export const deleteRestaurant = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: ServerError }
>("restaurant/deleteRestaurant", async (id: number, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.delete(`/restaurants/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({
      message: "Error in deleteRestaurant action",
    });
  }
});

export const createRestaurant = createAsyncThunk<
  { message: string },
  { name: string; email: string; phone: string },
  { rejectValue: ServerError }
>(
  "restaurant/createRestaurant",
  async ({ name, email, phone }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post(`/restaurants/`, {
        name,
        email,
        phone,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: "Error in createRestaurant action",
      });
    }
  },
);
