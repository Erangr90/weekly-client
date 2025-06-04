import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { resetPassword } from "@/features/auth/authActions";
import { setCode, setEmail } from "@/features/signUpForm/signUpFormSlice";
import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export default function ResetPasswordScreen() {
  const resetPasswordSchema = z.object({
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
    resolver: zodResolver(resetPasswordSchema),
  });

  type resetPasswordForm = z.infer<typeof resetPasswordSchema>;

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { email } = useSelector((state: RootState) => state.signUp);

  const onResetPassword = async (data: resetPasswordForm) => {
    if (data.password.trim() !== data.passwordValid.trim()) {
      setError("root", {
        type: "manual",
        message: "הסיסמאות אינן תואמות",
      });
      return;
    }
    try {
      if (!email) return;
      const { message } = await dispatch(
        resetPassword({ email: email.trim(), password: data.password.trim() }),
      ).unwrap();
      dispatch(setEmail(""));
      dispatch(setCode(""));
      Toast.show({ type: "success", text1: message, position: "bottom" });
      router.push("/");
    } catch (error: any) {
      if (typeof error.message === "string") {
        setError("root", {
          type: "manual",
          message: error.message,
        });
        return;
      }
      console.error("from component", error);
    }
  };

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#228B22" />
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <>
        <Text style={styles.title}>סיסמא חדשה</Text>
        <View style={styles.form}>
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
        </View>
        <CustomButton
          content="המשך"
          style={{ marginTop: 20 }}
          onPress={handleSubmit(onResetPassword)}
        />
        <StatusBar style="auto" />
      </>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
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
