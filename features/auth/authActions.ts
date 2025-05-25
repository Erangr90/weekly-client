import { ServerError } from "@/types/errors";
import { LoginForm, RegisterForm } from "@/types/forms";
import { User } from "@/types/users";
import axiosClient from "@/utils/axiosClient";
import {
  deleteExTime,
  deleteToken,
  saveExTime,
  saveToken,
} from "@/utils/secureStore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const login = createAsyncThunk<
  { user: User; token: string },
  LoginForm,
  { rejectValue: ServerError }
>("auth/login", async (form: LoginForm, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post("/auth/login", form);
    console.log(data);
    await saveToken(data.token);
    await saveExTime();
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Something went wrong" });
  }
});

export const register = createAsyncThunk<
  { user: User; token: string },
  RegisterForm,
  { rejectValue: ServerError }
>("auth/register", async (form: RegisterForm, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post("/auth/register", form);
    await saveToken(data.token);
    await saveExTime();
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Something went wrong" });
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await deleteToken();
    await deleteExTime();
    return;
  } catch (error) {
    console.error(error);
  }
});

export const verifyCode = createAsyncThunk<
  { code: string },
  string,
  { rejectValue: ServerError }
>("auth/verifyCode", async (email: string, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post("/auth/verifyCode", { email });
    console.log("from action", data);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Something went wrong" });
  }
});

export const verifyEmail = createAsyncThunk<
  { code: string },
  string,
  { rejectValue: ServerError }
>("auth/verifyEmail", async (email: string, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post("/auth/verifyEmail", { email });
    console.log("from action", data);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Something went wrong" });
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { email: string; password: string },
  { rejectValue: ServerError }
>(
  "auth/resetPassword",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await axiosClient.post("/auth/resetPassword", {
        email,
        password,
      });
      console.log("from action", data);
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  },
);
