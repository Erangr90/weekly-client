import { CreateDish, Dish, UpdateDish } from "@/types/dish";
import { ServerError } from "@/types/errors";
import axiosClient from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const createNewDish = createAsyncThunk<
  { message: string },
  CreateDish,
  { rejectValue: ServerError }
>(
  "dish/createNewDish",
  async (
    {
      name,
      price,
      restaurantId,
      image,
      description,
      allergyIds,
      ingredientIds,
    }: CreateDish,
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axiosClient.post("/dishes", {
        name,
        price,
        restaurantId,
        image,
        description,
        allergyIds,
        ingredientIds,
      });
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in createNewDish action" });
    }
  },
);

export const getDishesPage = createAsyncThunk<
  Dish[],
  { page: number; search?: string },
  { rejectValue: ServerError }
>(
  "dish/getDishesPage",
  async (
    { page, search }: { page: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      if (search && search !== "") {
        const { data } = await axiosClient.get(`/dishes/page`, {
          params: { page, search },
        });
        return data;
      } else {
        const { data } = await axiosClient.get(`/dishes/page`, {
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
        message: "Error in getDishesPage action",
      });
    }
  },
);

export const getDishById = createAsyncThunk<
  Dish,
  string,
  { rejectValue: ServerError }
>("dish/getDishById", async (id: string, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get(`/dishes/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({
      message: "Error in getDishById action",
    });
  }
});

export const updateDish = createAsyncThunk<
  { message: string },
  UpdateDish,
  { rejectValue: ServerError }
>("dish/updateDish", async (dish: UpdateDish, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.put(`/dishes/${dish.id}`, dish);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({
      message: "Error in updateDish action",
    });
  }
});

export const getUserDishes = createAsyncThunk<
  Dish[],
  { page: number; search?: string },
  { rejectValue: ServerError }
>(
  "dish/getUserDishes",
  async (
    { page, search }: { page: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      if (search && search !== "") {
        const { data } = await axiosClient.get(`/dishes/user`, {
          params: { page, search },
        });
        return data;
      } else {
        const { data } = await axiosClient.get(`/dishes/user`, {
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
        message: "Error in getUserDishes action",
      });
    }
  },
);
