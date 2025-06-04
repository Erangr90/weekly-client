import CustomButton from "@/components/CustomButton";
import { RootState } from "@/store";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

export default function WelcomeScreen() {
  const { user, isLogin } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined && isLogin) {
      router.push("/home");
    }
  }, [user, isLogin]);

  return (
    <>
      <Image
        source={require("@/assets/images/logo-color.png")}
        style={styles.logo}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>ברוכים הבאים</Text>
        <View style={styles.container}>
          <CustomButton
            content="התחברות"
            onPress={() => router.push("/signIn")}
          />
          <CustomButton
            style={{ backgroundColor: "red" }}
            content="התחבר באמצעות Google"
            onPress={() => {}}
          />
          <CustomButton
            style={{ backgroundColor: "#696969" }}
            content="התחבר באמצעות Apple"
            onPress={() => {}}
          />
          <Link href={"/signUp"} style={styles.link}>
            צור חשבון חדש
          </Link>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: "10%",
  },
  link: {
    color: "#228B22",
    fontWeight: "600",
    alignSelf: "center",
    fontSize: 16,
  },
  logo: {
    alignSelf: "center",
    height: "60%",
    maxWidth: "80%",
    maxHeight: "20%",
    marginTop: "10%",
  },
});
