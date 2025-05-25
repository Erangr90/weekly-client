import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { verifyEmail } from "@/features/auth/authActions";
import { setCode, setEmail } from "@/features/signUpForm/signUpFormSlice";
import { AppDispatch, RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export default function VerifyEmailScreen() {
  const emailSchema = z.object({
    email: z
      .string({ message: "אימייל הוא חובה" })
      .email("כתובת האימייל אינה תקינה"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  type emailForm = z.infer<typeof emailSchema>;

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const onVerify = async (data: emailForm) => {
    try {
      const { code } = await dispatch(verifyEmail(data.email)).unwrap();
      dispatch(setEmail(data.email));
      dispatch(setCode(code));
      router.push("/verifyForgotCode");
    } catch (error: any) {
      if (typeof error.message === "string") {
        setError("root", {
          type: "manual",
          message: error.message,
        });
        return;
      }
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    return (
      <>
        <Image
          source={require("@/assets/images/logo-color.png")}
          style={styles.logo}
        />
        {/* <Text style={styles.title}>אימות אימייל</Text> */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.content}>נא להזין את כתובת של חשבונך</Text>
          <Text>כתובת אימייל</Text>
          <View>
            <CustomInput
              control={control}
              name="email"
              placeholder="כתובת אימייל"
              autoFocus
              autoCapitalize="none"
            />
            {errors.root && (
              <Text style={{ color: "crimson", fontSize: 15, marginBlock: 10 }}>
                {"\u2022 "}
                {errors.root.message}
              </Text>
            )}
            <CustomButton
              content="המשך"
              onPress={handleSubmit(onVerify)}
              style={{ marginTop: 20 }}
            />
          </View>

          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    margin: 20,
  },
  logo: {
    width: "70%",
    alignSelf: "center",
    height: 100,
    maxWidth: 300,
    marginTop: 50,
  },
  content: {
    fontSize: 15,
    fontWeight: "300",
    textAlign: "center",
    marginVertical: 20,
  },
});
