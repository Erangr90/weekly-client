import Heder from "@/components/Header";
import { setCartSlice } from "@/features/cart/cartSlice";
import { AppDispatch, RootState } from "@/store";
import { getCartFromStorage } from "@/utils/asyncStorage";
import { Redirect, Slot } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function ProtectedLayout() {
  const { isLogin, user } = useSelector((state: RootState) => state.auth);
  const { cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const fetchCart = async () => {
    try {
      const storageCart = await getCartFromStorage();
      dispatch(setCartSlice(storageCart));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!cart) {
      fetchCart();
    }
  }, []);

  if (isLogin && user !== undefined) {
    return (
      <>
        <Heder />
        <Image
          source={require("@/assets/images/logo-color.png")}
          style={styles.logo}
        />
        <Slot />
      </>
    );
  } else {
    return <Redirect href={"/"} />;
  }
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    height: "50%",
    maxWidth: "80%",
    maxHeight: "20%",
    marginTop: "5%",
  },
  container: {
    flex: 1,
    direction: "rtl",
    backgroundColor: "white",
    justifyContent: "center",
  },
});
