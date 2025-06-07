import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import ImageUploader from "@/components/ImageUploader";
import PopupModal from "@/components/modals/PopUpModal";
import { getAllergies } from "@/features/allergy/allergyActions";
import { createNewDish } from "@/features/dish/dishActions";
import {
  createIngred,
  getAllIngredients,
} from "@/features/ingredients/ingredientsActions";
import { getAllRestaurants } from "@/features/restaurants/restaurantsActions";
import { uploadImage } from "@/features/uploads/uploadActions";
import { AppDispatch, RootState } from "@/store";
import { Allergy } from "@/types/allergy";
import { Ingredient } from "@/types/ingredient";
import { MiniRestaurant } from "@/types/restaurant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
export default function AddDishScreen() {
  const dishSchema = z.object({
    name: z
      .string({ message: "שם הוא חובה" })
      .min(2, "השם חייב להכיל לפחות 2 תווים")
      .max(50, "השם יכול להכיל עד 50 תווים")
      .regex(
        /^[A-Za-z\u0590-\u05FF ]+$/,
        "השם יכול להכיל רק אותיות באנגלית או בעברית ורווחים",
      ),
    price: z
      .string({ message: "מחיר הוא חובה" })
      .min(1)
      .max(6)
      .regex(/^[0-9]+(\.[0-9]{1,2})?$/, "מחיר לא תקין"),
    description: z
      .string({ message: "תיאור הוא חובה" })
      .min(2, "תיאור חייב להכיל לפחות 2 תווים")
      .max(500, "תיאור יכול להכיל עד 500 תווים")
      .regex(
        /^[A-Za-z\u0590-\u05FF ]+$/,
        "התיאור יכול להכיל רק אותיות באנגלית או בעברית ורווחים",
      ),
  });

  const addIngredSchema = z.object({
    name: z
      .string({ message: "שם האלרגיה הוא חובה" })
      .min(2, "שם האלרגיה חייב להכיל לפחות 2 תווים")
      .max(50, "שם האלרגיה יכול להכיל עד 50 תווים")
      .regex(
        /^[\u0590-\u05FF ]+$/,
        "שם האלרגיה יכול להכיל רק אותיות בעברית ורווחים",
      ),
  });

  const dishForm = useForm({ resolver: zodResolver(dishSchema) });
  const inngredForm = useForm({ resolver: zodResolver(addIngredSchema) });

  type newDish = z.infer<typeof dishSchema>;
  type newIngred = z.infer<typeof addIngredSchema>;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading: ingredLoading } = useSelector(
    (state: RootState) => state.ingredients,
  );

  const { loading: restLoading } = useSelector(
    (state: RootState) => state.restaurants,
  );

  const { loading: allergyLoading } = useSelector(
    (state: RootState) => state.allergies,
  );

  const [ingredients, setIngredients] = useState<Ingredient[] | undefined>(
    undefined,
  );

  const [restaurants, setRestaurants] = useState<MiniRestaurant[] | undefined>(
    undefined,
  );

  const [allergies, setAllergies] = useState<Allergy[] | undefined>(undefined);

  const [allergiesIds, setAllergiesIds] = useState<number[]>([]);
  const [filterAllergies, setFilterAllergies] = useState<Allergy[]>([]);
  const [selectedAllergy, setSelectedAllergy] = useState(0);
  const [searchAllergy, setSearchAllergy] = useState<string>("");

  const [restaurantId, setRestaurantId] = useState<number>(0);
  const [searchRes, setSearchRes] = useState<string>("");
  const [filterRes, setFilterRes] = useState<MiniRestaurant[]>([]);

  const [ingredientsIds, setIngredientsIds] = useState<number[]>([]);
  const [selectedIngred, setSelectedValue] = useState(0);
  const [searchIngred, setSearchIngred] = useState<string>("");
  const [filterIngreds, setFilterIngreds] = useState<Ingredient[]>([]);

  const [addShow, setAddShow] = useState(false);
  const [result, setResult] = useState<
    ImagePicker.ImagePickerResult | undefined
  >(undefined);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const fetchIngred = async () => {
    try {
      const res = await dispatch(getAllIngredients()).unwrap();
      setIngredients(res);
      setFilterIngreds(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRest = async () => {
    try {
      const res = await dispatch(getAllRestaurants()).unwrap();
      setRestaurants(res);
      setFilterRes(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllergies = async () => {
    try {
      const res = await dispatch(getAllergies()).unwrap();
      setAllergies(res);
      setFilterAllergies(res);
    } catch (error) {
      console.error(error);
    }
  };

  const onFilterIngred = (filter: string) => {
    const temp = ingredients!.filter((ingred) => ingred.name.includes(filter));
    setFilterIngreds(temp);
  };

  const onFilterRest = (filter: string) => {
    const temp = restaurants!.filter((rest) => rest.name.includes(filter));
    setFilterRes(temp);
  };

  const onFilterAllergy = (filter: string) => {
    const temp = allergies!.filter((allergy) => allergy.name.includes(filter));
    setFilterAllergies(temp);
  };

  const addNewIngred = async (data: newIngred) => {
    Alert.alert(
      "האם את/ה בטוח/ה ?", // Title
      "", // Optional message
      [
        {
          text: "ביטול", // Cancel
          onPress: () => console.log("User pressed Cancel"),
          style: "cancel",
        },
        {
          text: "אישור", // OK
          onPress: async () => {
            try {
              const { message } = await dispatch(
                createIngred(data.name),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/addDish");
            } catch (error: any) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: error.message,
                position: "bottom",
              });
              inngredForm.setError("name", {
                type: "manual",
                message: error.message,
              });
            }
          },
        },
      ],
      { cancelable: false }, // Optional: prevent closing the alert by tapping outside
    );
  };

  useEffect(() => {
    if (!searchIngred || searchIngred === "") {
      setFilterIngreds(ingredients!);
    } else {
      onFilterIngred(searchIngred);
    }
    if (!searchAllergy || searchAllergy === "") {
      setFilterAllergies(allergies!);
    } else {
      onFilterAllergy(searchAllergy);
    }
    if (!searchRes || searchRes === "") {
      setFilterRes(restaurants!);
    } else {
      onFilterRest(searchRes!);
    }
  }, [searchIngred, searchAllergy, searchRes]);

  useEffect(() => {
    if (!ingredients) {
      fetchIngred();
    }
    if (!restaurants) {
      fetchRest();
    }
    if (!allergies) {
      fetchAllergies();
    }
  }, [ingredients, restaurants, allergies]);

  const onAdd = async (data: newDish) => {
    Alert.alert(
      "האם את/ה בטוח/ה ?", // Title
      "", // Optional message
      [
        {
          text: "ביטול", // Cancel
          onPress: () => console.log("User pressed Cancel"),
          style: "cancel",
        },
        {
          text: "אישור", // OK
          onPress: async () => {
            try {
              const cloudUrl = await dispatch(uploadImage(result!)).unwrap();
              const { message } = await dispatch(
                createNewDish({
                  name: data.name,
                  price: Number(data.price),
                  restaurantId: restaurantId,
                  image: cloudUrl,
                  description: data.description,
                  allergyIds: allergiesIds,
                  ingredientIds: ingredientsIds,
                }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/dishes");
            } catch (error: any) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: error.message,
                position: "bottom",
              });
            }
          },
        },
      ],
      { cancelable: false }, // Optional: prevent closing the alert by tapping outside
    );
  };

  if (
    ingredLoading ||
    restLoading ||
    allergyLoading ||
    ingredients === undefined ||
    restaurants === undefined ||
    allergies === undefined
  ) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>הוספת מנה</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <ImageUploader setImageUrl={setImageUrl} setResult={setResult} />
            {imageUrl && (
              <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            <Text>מסעדה</Text>
            {restaurantId !== 0 && (
              <Text style={{ marginTop: 5, fontWeight: "bold" }}>
                נבחרה:{" "}
                {restaurants?.find((rest) => rest.id === restaurantId)?.name}
              </Text>
            )}
            <TextInput
              value={searchRes}
              placeholder="חיפוש ..."
              style={styles.search}
              onChangeText={(text: string) => setSearchRes(text.trim())}
              placeholderTextColor="gray"
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={restaurantId}
                onValueChange={(itemValue) => {
                  setRestaurantId(itemValue);
                }}
                style={styles.picker}
                itemStyle={styles.item}
              >
                {filterRes.map((rest) => (
                  <Picker.Item
                    key={rest.id}
                    label={rest.name}
                    value={rest.id}
                  />
                ))}
              </Picker>
            </View>
            <Text>שם המנה</Text>
            <CustomInput
              control={dishForm.control}
              name="name"
              placeholder="שם המנה"
              autoFocus
            />
            <Text>מרכיבים</Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                value={searchIngred}
                placeholder="חיפוש ..."
                style={styles.search}
                onChangeText={(text: string) => setSearchIngred(text.trim())}
                placeholderTextColor="gray"
              />
              <CustomButton content="הוספה" onPress={() => setAddShow(true)} />
            </View>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedIngred}
                onValueChange={(itemValue) => {
                  if (!ingredientsIds.includes(itemValue)) {
                    setIngredientsIds([...ingredientsIds, itemValue]);
                  }
                }}
                style={styles.picker}
                itemStyle={styles.item}
              >
                {filterIngreds.map((ingred) => (
                  <Picker.Item
                    key={ingred.id}
                    label={ingred.name}
                    value={ingred.id}
                  />
                ))}
              </Picker>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 10,
                maxWidth: "90%",
                flexWrap: "wrap",
              }}
            >
              {ingredientsIds.length > 0 &&
                ingredientsIds.map((id) => (
                  <View key={id} style={{ flexDirection: "row" }}>
                    <Pressable
                      style={{
                        flexDirection: "row",
                        gap: 5,
                      }}
                      onPress={() => {
                        setIngredientsIds(
                          ingredientsIds.filter((Iid) => Iid !== id),
                        );
                      }}
                    >
                      <Text>❌</Text>
                      <Text>
                        {ingredients?.find((ingred) => ingred.id === id)?.name}
                      </Text>
                    </Pressable>
                  </View>
                ))}
            </View>
            <Text>אלרגיות</Text>
            <TextInput
              value={searchAllergy}
              placeholder="חיפוש ..."
              style={styles.search}
              onChangeText={(text: string) => setSearchAllergy(text.trim())}
              placeholderTextColor="gray"
            />
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedAllergy}
                onValueChange={(itemValue) => {
                  if (!allergiesIds.includes(itemValue)) {
                    setAllergiesIds([...allergiesIds, itemValue]);
                  }
                }}
                style={styles.picker}
                itemStyle={styles.item}
              >
                {filterAllergies.map((allergy) => (
                  <Picker.Item
                    key={allergy.id}
                    label={allergy.name}
                    value={allergy.id}
                  />
                ))}
              </Picker>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 10,
                maxWidth: "90%",
                flexWrap: "wrap",
              }}
            >
              {allergiesIds.length > 0 &&
                allergiesIds.map((id) => (
                  <View key={id} style={{ flexDirection: "row" }}>
                    <Pressable
                      style={{
                        flexDirection: "row",
                        gap: 5,
                      }}
                      onPress={() => {
                        setAllergiesIds(
                          allergiesIds.filter((Iid) => Iid !== id),
                        );
                      }}
                    >
                      <Text>❌</Text>
                      <Text>
                        {allergies?.find((allergy) => allergy.id === id)?.name}
                      </Text>
                    </Pressable>
                  </View>
                ))}
            </View>
            <Text>מחיר</Text>
            <CustomInput
              control={dishForm.control}
              name="price"
              placeholder="מחיר"
              keyboardType="decimal-pad"
            />
            <Text>תיאור</Text>
            <CustomInput
              control={dishForm.control}
              name="description"
              placeholder="תיאור"
              multiline={true}
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
          <CustomButton
            content="הוספה"
            style={{ marginTop: 20 }}
            onPress={dishForm.handleSubmit(onAdd)}
          />
        </ScrollView>
        <PopupModal
          visible={addShow}
          onClose={() => setAddShow(false)}
          title="הוספת מרכיב חדש"
        >
          <CustomInput
            control={inngredForm.control}
            name="name"
            style={styles.addInput}
            placeholder="מרכיב חדש"
            placeholderTextColor="gray"
          />
          <CustomButton
            content="הוספה"
            onPress={inngredForm.handleSubmit(addNewIngred)}
            style={styles.addButton}
          />
        </PopupModal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: "5%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    gap: 10,
  },
  textArea: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
  },
  selectContainer: {
    direction: "rtl",
  },
  picker: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    overflow: "hidden",
  },
  item: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  search: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "right",
    writingDirection: "rtl",
  },
  addButton: {
    paddingVertical: 10,
    marginTop: "5%",
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
  },
});
