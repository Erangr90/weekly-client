import PopupModal from "@/components/AddIngrModal";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { getUserIngr, updateUserIng } from "@/features/auth/authActions";
import {
  addPendingIngr,
  getAllIngredient,
} from "@/features/ingredients/ingredientsActions";
import { AppDispatch, RootState } from "@/store";
import { Ingredient } from "@/types/ingredient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

export default function DontLikeScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filterIngredients, setFilterIngredients] = useState<Ingredient[]>([]);
  const [userIngredients, setUserIngredients] = useState<number[]>([]);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.ingredients,
  );

  const ingrNameSchema = z.object({
    name: z
      .string({ message: "שם המרכיב הוא חובה" })
      .min(2, "שם המרכיב חייב להכיל לפחות 2 תווים")
      .max(50, "שם המרכיב יכול להכיל עד 50 תווים")
      .regex(
        /^[\u0590-\u05FF ]+$/,
        "שם המרכיב יכול להכיל רק אותיות בעברית ורווחים",
      ),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(ingrNameSchema),
  });

  type IngrName = z.infer<typeof ingrNameSchema>;

  const router = useRouter();

  const toggleIngredients = (ingredient: Ingredient) => {
    const exists = userIngredients.includes(ingredient.id);
    if (exists) {
      const arr = userIngredients.filter((a) => a !== ingredient.id);
      setUserIngredients(arr);
    } else {
      setUserIngredients([...userIngredients, ingredient.id]);
    }
  };

  const onSubmit = async () => {
    try {
      const { message } = await dispatch(
        updateUserIng({ userId: String(user!.id!), ids: userIngredients }),
      ).unwrap();
      Toast.show({ type: "success", text1: message, position: "bottom" });
      router.push("/home");
    } catch (error: any) {
      console.error(error);
    }
  };

  const onFilter = () => {
    let temp: Ingredient[] = [];
    for (const ing of ingredients) {
      if (ing.name.includes(filter!)) {
        temp.push(ing);
      }
    }
    setFilterIngredients(temp);
  };

  const fetchIngredients = async () => {
    try {
      const res = await dispatch(getAllIngredient()).unwrap();
      setIngredients(res);
      setFilterIngredients(res);
    } catch (error) {
      console.error(error);
    }
  };
  const onAdd = async (data: IngrName) => {
    try {
      const { message } = await dispatch(
        addPendingIngr({ name: data.name.trim() }),
      ).unwrap();
      Toast.show({ type: "success", text1: message, position: "bottom" });
      setModalVisible(false);
      reset({ name: "" });
    } catch (error: any) {
      setError("root", {
        type: "manual",
        message: error.message,
      });
      console.error(error);
      Toast.show({
        type: "error",
        text1: error.message as string,
        position: "bottom",
      });
    }
  };

  const fetchUserIngr = async () => {
    const res = await dispatch(getUserIngr(user!.id!)).unwrap();
    setUserIngredients(res.ingredientIds);
  };

  useEffect(() => {
    if (filter === "" || filter === undefined) {
      setFilterIngredients(ingredients);
    }
    onFilter();
  }, [filter]);

  useEffect(() => {
    fetchIngredients();
    fetchUserIngr();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <>
        <Text style={styles.title}>לא אהבתי ...</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.row}>
            <TextInput
              value={filter}
              placeholder="חיפוש ..."
              style={styles.search}
              onChangeText={(text) => setFilter(text.trim())}
              placeholderTextColor="gray"
            />
            <CustomButton
              content="הוספה"
              onPress={() => setModalVisible(true)}
            />
          </View>
        </KeyboardAvoidingView>
        <PopupModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="הוספת מרכיב חדש"
        >
          <CustomInput
            control={control}
            name="name"
            style={styles.addInput}
            placeholder="מרכיב חדש"
            placeholderTextColor="gray"
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
          <CustomButton
            content="הוספה"
            onPress={handleSubmit(onAdd)}
            style={styles.addButton}
          />
        </PopupModal>
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.grid}>
              {filterIngredients.map((ingredient, index) => {
                const isSelected = userIngredients.includes(ingredient.id);
                return (
                  <Pressable
                    key={index}
                    onPress={() => toggleIngredients(ingredient)}
                    style={styles.gridItem}
                  >
                    <Text style={styles.itemText}>
                      {isSelected ? "❌" : "⬜"} {ingredient.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <CustomButton content="שמירה" onPress={onSubmit} />
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginTop: "2%",
    marginBottom: "5%",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  gridItem: {
    width: 100,
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#b2fab4",
    borderColor: "#228B22",
  },
  itemText: {
    textAlign: "center",
  },
  error: {
    color: "crimson",
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    padding: 20,
  },
  search: {
    flex: 1,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "right",
    writingDirection: "rtl",
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 20,
  },
  searchButton: {
    paddingHorizontal: 20,
    height: 50,
    justifyContent: "center",
  },
  addInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    textAlign: "right",
    writingDirection: "rtl",
    marginRight: 10,
    color: "black",
  },
  addButton: {
    paddingVertical: 11,
  },
});
