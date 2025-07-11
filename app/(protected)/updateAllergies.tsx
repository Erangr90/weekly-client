import CustomButton from "@/components/CustomButton";
import { getAllergies } from "@/features/allergy/allergyActions";
import { updateUserAllergy } from "@/features/auth/authActions";
import { AppDispatch, RootState } from "@/store";
import { Allergy } from "@/types/allergy";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
export default function UpdateAllergiesScreen() {
  const [allergies, setAllergies] = useState<Allergy[] | null>(null);
  const [userAllergies, setUserAllergies] = useState<number[]>([]);

  const toggleAllergy = (allergy: Allergy) => {
    const exists = userAllergies.includes(allergy.id);
    if (exists) {
      const arr = userAllergies.filter((a) => a !== allergy.id);
      setUserAllergies(arr);
    } else {
      setUserAllergies([...userAllergies, allergy.id]);
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const { loading, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const onSubmit = async () => {
    try {
      const { message } = await dispatch(
        updateUserAllergy({ ids: userAllergies, userId: String(user?.id) }),
      ).unwrap();
      Toast.show({
        type: "success",
        text1: message,
        position: "bottom",
      });
      router.push("/home");
    } catch (error: any) {
      console.error(error);
    }
  };

  const fetchAllergies = async () => {
    try {
      const res = await dispatch(getAllergies()).unwrap();
      setAllergies(res);
    } catch (error) {
      console.error(error);
    }
  };

  const createUserAllergies = () => {
    const temp = user!.allergies.map((allergy) => allergy.id);
    setUserAllergies(temp);
  };

  useEffect(() => {
    if (!allergies) {
      fetchAllergies();
      createUserAllergies();
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>הרגישוית שלי</Text>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View style={styles.grid}>
            {allergies &&
              allergies.map((allergy, index) => {
                const isSelected = userAllergies.includes(allergy.id);
                return (
                  <Pressable
                    key={index}
                    onPress={() => toggleAllergy(allergy)}
                    style={[styles.gridItem, isSelected && styles.selectedItem]}
                  >
                    <Text>{allergy.name}</Text>
                  </Pressable>
                );
              })}
          </View>
        </ScrollView>
        <CustomButton content="שמירה" onPress={onSubmit} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    padding: 20,
  },
  grid: {
    flex: 1,
    marginRight: 20,
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
});
