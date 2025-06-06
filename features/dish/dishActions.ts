import { CreateDish } from "@/types/dish";
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
