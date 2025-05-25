import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {}, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Image
        source={require("@/assets/images/logo-color.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>ברוכים הבאים</Text>
      <View style={styles.container}>
        <CustomButton
          content="התחברות"
          onPress={() => router.push("/signIn")}
        />
        <CustomButton
          style={{ backgroundColor: "crimson" }}
          content="התחבר באמצעות Google"
          onPress={() => {}}
        />
        <CustomButton
          style={{ backgroundColor: "#A9A9A9" }}
          content="התחבר באמצעות Apple"
          onPress={() => {}}
        />
        <Link href={"/signUp"} style={styles.link}>
          צור חשבון חדש
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  link: {
    color: "#4353fd",
    fontWeight: "600",
    alignSelf: "center",
    fontSize: 16,
  },
  logo: {
    width: "70%",
    alignSelf: "center",
    height: 100,
    maxWidth: 300,
    maxHeight: 200,
    marginTop: 80,
    marginBottom: 40,
  },
});
