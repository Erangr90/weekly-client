import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { uploadLocally } from "../utils/uploadImage";
import CustomButton from "./CustomButton";

interface ImageUploaderProps {
  setImageUrl: (url: string) => void;
  setResult: (result: ImagePicker.ImagePickerResult) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setImageUrl,
  setResult,
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    try {
      setLoading(true);
      const result = await uploadLocally();
      setResult(result);
      setImageUrl(result.assets ? result.assets[0].uri : "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <CustomButton content="העלאת תמונה" onPress={handleUpload} />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#228B22"
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
};

export default ImageUploader;
