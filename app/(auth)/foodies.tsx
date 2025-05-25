import CustomButton from "@/components/CustomButton";
import { register } from "@/features/auth/authActions";
import {
  setCode,
  setEmail,
  setFullName,
  setPassword,
} from "@/features/signUpForm/signUpFormSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function FoodiesScreen() {
  const allergies = ["לקטוז", "גלוטן", "בוטנים", "צמחוני", "טבעוני"];
  const [userAllergies, setUserAllergies] = useState<string[]>([]);

  const toggleAllergy = (allergy: string) => {
    const exists = userAllergies.includes(allergy);
    if (exists) {
      const arr = userAllergies.filter((a) => a !== allergy);
      setUserAllergies(arr);
    } else {
      setUserAllergies([...userAllergies, allergy]);
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { fullName, email, password } = useSelector(
    (state: RootState) => state.signUp,
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const onEndSignUp = async () => {
    console.log(userAllergies);
    try {
      if (!email || !fullName || !password) {
        setError("משהו השתבש");
        return;
      }
      await dispatch(
        register({
          fullName,
          email,
          password,
        }),
      ).unwrap();
      dispatch(setFullName(""));
      dispatch(setEmail(""));
      dispatch(setPassword(""));
      dispatch(setCode(""));
      router.push("/home");
    } catch (error: any) {
      setError(error.message);
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
        <View style={styles.container}>
          <Text style={styles.title}>הרגישוית שלי</Text>
          <View style={styles.grid}>
            {allergies.map((allergy) => {
              const isSelected = userAllergies.includes(allergy);
              return (
                <Pressable
                  key={allergy}
                  onPress={() => toggleAllergy(allergy)}
                  style={[styles.gridItem, isSelected && styles.selectedItem]}
                >
                  <Text>{allergy}</Text>
                </Pressable>
              );
            })}
          </View>
          {error && (
            <Text
              style={{
                color: "crimson",
                marginBottom: 10,
              }}
            >
              {"\u2022 "}
              {error}
            </Text>
          )}
          <CustomButton content="סיום" onPress={onEndSignUp} />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    height: 270,
  },
  gridItem: {
    width: 90, // fixed width
    height: 90, // fixed height (same as width)
    borderRadius: 45, // half of width/height for a perfect circle
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 5, // spacing between items
  },
  selectedItem: {
    backgroundColor: "#b2fab4", // light green
  },
  logo: {
    width: "70%",
    alignSelf: "center",
    height: 100,
    maxWidth: 300,
    maxHeight: 200,
    marginTop: 40,
  },
});
