import Heder from "@/components/Header";
import { RootState } from "@/store";
import { Redirect, Slot } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

export default function ProtectedLayout() {
  const { isLogin, user } = useSelector((state: RootState) => state.auth);

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
