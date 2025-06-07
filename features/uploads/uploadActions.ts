import { ServerError } from "@/types/errors";
import axiosClient from "@/utils/axiosClient";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";

export const uploadImage = createAsyncThunk<
  string,
  ImagePicker.ImagePickerResult,
  { rejectValue: ServerError }
>(
  "upload/uploadImage",
  async (result: ImagePicker.ImagePickerResult, { rejectWithValue }) => {
    try {
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        const localUri = asset.uri;
        const formData = new FormData();

        formData.append("image", {
          uri: localUri,
          name: "upload.jpg",
          type: "image/jpeg",
        } as any);
        const res = await axiosClient.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Uploaded image URL:", res.data.url);
        return res.data.url;
      }
    } catch (err) {
      const error = err as AxiosError<ServerError>;
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({
        message: "Error in uploadImage action",
      });
    }
  },
);
