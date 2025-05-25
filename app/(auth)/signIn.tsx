import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { login } from "@/features/auth/authActions";
import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export default function SignInScreen() {
  const signInSchema = z.object({
    email: z
      .string({ message: "אימייל הוא חובה" })
      .email("כתובת האימייל אינה תקינה"),
    password: z
      .string({ message: "סיסמא היא חובה" })
      .min(8, "סיסמא חייבת להכיל לפחות 8 תווים")
      .max(50, "הסיסמא יכולה להכיל עד 50 תווים")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "הסיסמה חייבת להכיל לפחות אות גדולה, אות קטנה, ספרה ותו מיוחד",
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  type SignInForm = z.infer<typeof signInSchema>;

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  // In case there is array of errors messages from the server
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const onSignIn = async (data: SignInForm) => {
    try {
      await dispatch(login(data)).unwrap();
      router.push("/home");
    } catch (error: any) {
      if (typeof error?.message === "string") {
        setError("root", {
          type: "manual",
          message: error.message,
        });
        return;
      }
      // In case there is array of errors messages from the server
      if (typeof error?.message === "object" && error.message.length > 0) {
        setServerErrors([...error.message]);
        return;
      }
      console.error(error);
    }
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("@/assets/images/logo-color.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>התחברות</Text>
        <View style={styles.form}>
          <Text>כתובת אימייל</Text>
          <CustomInput
            control={control}
            name="email"
            placeholder="כתובת אימייל"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Text>סיסמא</Text>
          <CustomInput
            control={control}
            name="password"
            placeholder="סיסמא"
            secureTextEntry={true}
            autoCapitalize="none"
          />
          {errors.root && (
            <Text
              style={{
                color: "crimson",
                marginBottom: 10,
              }}
            >
              {"\u2022 "}
              {errors.root.message}
            </Text>
          )}
          {/* In case there is array of errors messages from the server */}
          {serverErrors &&
            serverErrors.length > 0 &&
            serverErrors.map((error, index) => (
              <Text
                key={index}
                style={{
                  color: "crimson",
                  marginBottom: 10,
                }}
              >
                {"\u2022 "}
                {error}
              </Text>
            ))}
        </View>
        <CustomButton
          content="התחבר"
          style={{ marginTop: 20 }}
          onPress={handleSubmit(onSignIn)}
        />
        <Pressable onPress={() => router.push("/verifyEmail")}>
          <Text style={styles.link}>שכחתי סיסמא</Text>
        </Pressable>
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  form: {
    gap: 5,
  },
  logo: {
    width: "70%",
    alignSelf: "center",
    height: 100,
    maxWidth: 300,
    maxHeight: 200,
  },
  link: {
    color: "#F2003C",
    fontWeight: "600",
    alignSelf: "center",
    fontSize: 16,
    marginTop: 30,
  },
});
