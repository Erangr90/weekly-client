import * as ImagePicker from "expo-image-picker";

export async function uploadLocally() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
  });
  return result;
}
