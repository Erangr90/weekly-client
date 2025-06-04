import { Slot } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/logo-color.png")}
          style={styles.logo}
        />
        <Slot />
      </View>
    </>
  );
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
    justifyContent: "flex-start",
  },
});
