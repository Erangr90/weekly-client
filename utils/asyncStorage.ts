import { OrderItem } from "@/types/orderItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Cart = {
  orderItems: OrderItem[];
};

export const saveCartToStorage = async (cart: Cart) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Saving cart failed", error);
  }
};

export const getCartFromStorage = async () => {
  try {
    const cart = await AsyncStorage.getItem("cart");
    return cart ? JSON.parse(cart) : { orderItems: [] };
  } catch (error) {
    console.error("Loading cart failed", error);
    return null;
  }
};

export const clearCartFromStorage = async () => {
  try {
    await AsyncStorage.removeItem("cart");
  } catch (error) {
    console.error("Clearing cart failed", error);
  }
};
