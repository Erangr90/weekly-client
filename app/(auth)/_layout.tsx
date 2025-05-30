import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require("@/assets/images/logo-color.png")}
        style={styles.logo}
      /> */}
      <Slot />
    </View>
  );
  // return (<Slot />);
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    height: 100,
    maxWidth: 300,
    maxHeight: 100,
    marginTop: "20%",
  },
  container: {
    flex: 1,
    direction: "rtl",
    backgroundColor: "white",
    justifyContent: "center",
  },
});
