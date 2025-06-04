import { store } from "@/store";
import toastConfig from "@/utils/toastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import * as Updates from "expo-updates";
import { useEffect } from "react";
import { I18nManager, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import LoginTime from "../components/LoginTime";
export default function RootLayout() {
  useEffect(() => {
    const enforceRTL = async () => {
      const rtlSet = await AsyncStorage.getItem("rtl-applied");

      if (!I18nManager.isRTL && rtlSet !== "true") {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
        I18nManager.swapLeftAndRightInRTL(false);
        await AsyncStorage.setItem("rtl-applied", "true");

        try {
          await Updates.reloadAsync(); // Reload only once
        } catch (e) {
          console.error("Failed to reload app after setting RTL", e);
        }
      }
    };

    enforceRTL();
  }, []);
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <LoginTime />
        <Toast config={toastConfig} />
        <Slot />
      </SafeAreaView>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: "rtl",
    backgroundColor: "white",
    justifyContent: "center",
  },
});
