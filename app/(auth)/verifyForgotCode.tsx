import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { RootState } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { z } from "zod";

export default function VerifyForgotCodeScreen() {
  const verifySchema = z.object({
    code: z
      .string({ message: "חוב להזין קוד אימות" })
      .length(6, "קוד האימות חייב להכיל 6 ספרות")
      .regex(/^[0-9]+$/, "קוד האימות חייב להכיל מספרים בלבד"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(verifySchema),
  });

  type verifyForm = z.infer<typeof verifySchema>;
  const { code } = useSelector((state: RootState) => state.signUp);

  const router = useRouter();

  const onVerify = async (data: verifyForm) => {
    if (data.code !== code) {
      setError("root", {
        message: "קוד האימות שגוי",
      });
      return;
    } else {
      router.push("/resetPassword");
    }
  };

  return (
    <>
      {/* <Text style={styles.title}>אימות הרשמה</Text> */}
      <Text style={styles.content}>קוד אימות נשלח לכתובת של חשבונך</Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text>קוד אימות</Text>
        <View>
          <CustomInput
            control={control}
            name="code"
            placeholder="קוד אימות"
            autoFocus
            keyboardType="number-pad"
          />
          {errors.root && (
            <Text style={{ color: "crimson", fontSize: 15 }}>
              {"\u2022 "}
              {errors.root.message}
            </Text>
          )}
        </View>
        <CustomButton
          content="המשך"
          onPress={handleSubmit(onVerify)}
          style={{ marginTop: 5 }}
        />
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
    </>
  );
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
