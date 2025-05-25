import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { verifyCode } from "@/features/auth/authActions";
import {
  setCode,
  setEmail,
  setFullName,
  setPassword,
} from "@/features/signUpForm/signUpFormSlice";
import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export default function SignUpScreen() {
  const signUpSchema = z.object({
    email: z
      .string({ message: "אימייל הוא חובה" })
      .email("כתובת האימייל אינה תקינה"),
    fullName: z
      .string({ message: "שם הוא חובה" })
      .min(2, "השם חייב להכיל לפחות 2 תווים")
      .max(50, "השם יכול להכיל עד 50 תווים")
      .regex(
        /^[A-Za-z\u0590-\u05FF ]+$/,
        "השם יכול להכיל רק אותיות באנגלית או בעברית ורווחים",
      ),
    password: z
      .string({ message: "סיסמא היא חובה" })
      .min(8, "סיסמא חייבת להכיל לפחות 8 תווים")
      .max(50, "הסיסמא יכולה להכיל עד 50 תווים")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
        "הסיסמה חייבת להכיל לפחות אות גדולה, אות קטנה, ספרה ותו מיוחד",
      ),
    passwordValid: z
      .string({ message: "אימות סיסמא הוא חובה" })
      .min(8, "סיסמא חייבת להכיל לפחות 8 תווים")
      .max(50, "הסיסמא יכולה להכיל עד 50 תווים"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  type SignUpForm = z.infer<typeof signUpSchema>;

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  // In case there is array of errors messages from the server
  const [serverErrors, setServerErrors] = useState<string[] | null>(null);

  const onSignUp = async (data: SignUpForm) => {
    if (data.password !== data.passwordValid) {
      setError("root", {
        type: "manual",
        message: "הסיסמאות אינן תואמות",
      });
      return;
    }
    try {
      const { code } = await dispatch(verifyCode(data.email)).unwrap();
      dispatch(setFullName(data.fullName));
      dispatch(setEmail(data.email));
      dispatch(setPassword(data.password));
      dispatch(setCode(code));
      router.push("/verifyCode");
    } catch (error: any) {
      if (typeof error.message === "string") {
        setError("root", {
          type: "manual",
          message: error.message,
        });
        return;
      }
      // In case there is array of errors messages from the server
      if (typeof error.message === "object" && error.message.length > 0) {
        setServerErrors([...error.message]);
        return;
      }
      console.error("from component", error);
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
        {/* <Image
          source={require("@/assets/images/logo-color.png")}
          style={styles.logo}
        /> */}
        <Text style={styles.title}>יצירת חשבון</Text>
        <View style={styles.form}>
          <Text>שם מלא</Text>
          <CustomInput
            control={control}
            name="fullName"
            placeholder="שם מלא"
            autoFocus
          />
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
          <Text>אימות סיסמא</Text>
          <CustomInput
            control={control}
            name="passwordValid"
            placeholder="אימות סיסמא"
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
          content="המשך"
          style={{ marginTop: 20 }}
          onPress={handleSubmit(onSignUp)}
        />
        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    gap: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 10,
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
});
