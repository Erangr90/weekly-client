import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "jwt_token";
const EX_TIME_KEY = "expirationTime";

export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token to SecureStore:", error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token from SecureStore:", error);
    return null;
  }
};

export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error deleting token from SecureStore:", error);
  }
};

export const saveExTime = async (): Promise<void> => {
  try {
    const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 7 days
    await SecureStore.setItemAsync(EX_TIME_KEY, expirationTime.toString());
  } catch (error) {
    console.error("Error saving expirationTime to SecureStore:", error);
  }
};

export const getExTime = async (): Promise<number | null> => {
  try {
    const exTime = await SecureStore.getItemAsync(EX_TIME_KEY);
    return Number(exTime);
  } catch (error) {
    console.error("Error getting expirationTime to SecureStore:", error);
    return null;
  }
};

export const deleteExTime = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(EX_TIME_KEY);
  } catch (error) {
    console.error("Error deleting expirationTime from SecureStore:", error);
  }
};
