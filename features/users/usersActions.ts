import { ServerError } from "@/types/errors";
import { User } from "@/types/users";
import axiosClient from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: ServerError }
>("users/getUsers", async (_: void, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get("/users");
    console.log(data);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Something went wrong" });
  }
});
