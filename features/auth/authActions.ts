import { ServerError } from "@/types/errors";
import { LoginForm, RegisterForm } from "@/types/forms";
import { User, UserIngr } from "@/types/users";
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
    await saveToken(data.token);
    await saveExTime();
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in login action" });
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
    return rejectWithValue({ message: "Error in register action" });
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
    return rejectWithValue({ message: "Error in verifyCode action" });
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
    return rejectWithValue({ message: "Error in verifyEmail action" });
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
      return rejectWithValue({ message: "Error in resetPassword action" });
    }
  },
);

export const updateUserIng = createAsyncThunk<
  { user: User; message: string },
  { userId: string; ids: number[] },
  { rejectValue: ServerError }
>("auth/updateUserIng", async ({ userId, ids }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.put(`/users/${userId}/like`, { ids });
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in updateUserIng action" });
  }
});

export const updateUserAllergy = createAsyncThunk<
  { user: User; message: string },
  { userId: string; ids: number[] },
  { rejectValue: ServerError }
>("auth/updateUserAllergy", async ({ userId, ids }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.put(`/users/${userId}/allergy`, { ids });
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in updateUserAllergy action" });
  }
});

export const getAllUsers = createAsyncThunk<
  User[],
  { page: number; search?: string },
  { rejectValue: ServerError }
>(
  "auth/getAllUsers",
  async (
    { page, search }: { page: number; search?: string },
    { rejectWithValue },
  ) => {
    try {
      if (search && search !== "") {
        const { data } = await axiosClient.get(`/users`, {
          params: { page, search },
        });
        return data;
      } else {
        const { data } = await axiosClient.get(`/users`, {
          params: { page },
        });
        return data;
      }
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in getAllUsers action" });
    }
  },
);

export const updateUserRole = createAsyncThunk<
  { message: string },
  { id: number; role: string },
  { rejectValue: ServerError }
>(
  "auth/updateUserRole",
  async ({ id, role }: { id: number; role: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/users/${id}/role`, { role });
      return data;
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Error in updateUserRole action" });
    }
  },
);

export const deleteUser = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: ServerError }
>("auth/deleteUser", async (id: number, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.delete(`/users/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in deleteUser action" });
  }
});

export const getUserIngr = createAsyncThunk<
  UserIngr,
  number,
  { rejectValue: ServerError }
>("users/getUserById", async (id: number, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.get(`/users/${id}/ingr`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ServerError>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ message: "Error in getUserById action" });
  }
});
