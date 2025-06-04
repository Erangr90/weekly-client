import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import PopupModal from "@/components/modals/PopUpModal";
import ResTable from "@/components/tables/resTable";
import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantsPage,
  updateRestaurant,
} from "@/features/restaurants/restaurantsActions";
import { AppDispatch, RootState } from "@/store";
import { Restaurant } from "@/types/restaurant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
export default function AdminResScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [restaurants, setRestaurants] = useState<Restaurant[] | undefined>(
    undefined,
  );
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editAble, setEditAble] = useState(false);
  const { loading } = useSelector((state: RootState) => state.restaurants);
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>(
    undefined,
  );
  const router = useRouter();

  const editSchema = z.object({
    name: z
      .string({ message: "שם המסעדה הוא חובה" })
      .min(2, "שם המסעדה חייב להכיל לפחות 2 תווים")
      .max(50, "שם המסעדה יכול להכיל עד 50 תווים")
      .regex(
        /^[a-zA-Z\u0590-\u05FF ]+$/,
        "שם האלרגיה יכול להכיל רק אותיות בעברית ורווחים",
      )
      .optional(),
    email: z
      .string({ message: "אימייל הוא חובה" })
      .email("כתובת האימייל אינה תקינה")
      .optional(),
    phone: z
      .string({ message: "טלפון הוא חובה" })
      .min(9, "מספר הטלפון חייב להכיל לפחות 9 מספרים")
      .max(10, "מספר הטלפון חייב להכיל עד 10 מספרים")
      .regex(/^[0-9]{9,10}$/, "מספר הטלפון לא תקין")
      .optional(),
  });

  const addSchema = z.object({
    name: z
      .string({ message: "שם המסעדה הוא חובה" })
      .min(2, "שם המסעדה חייב להכיל לפחות 2 תווים")
      .max(50, "שם המסעדה יכול להכיל עד 50 תווים")
      .regex(
        /^[a-zA-Z\u0590-\u05FF ]+$/,
        "שם האלרגיה יכול להכיל רק אותיות בעברית ורווחים",
      ),
    email: z
      .string({ message: "אימייל הוא חובה" })
      .email("כתובת האימייל אינה תקינה"),
    phone: z
      .string({ message: "טלפון הוא חובה" })
      .min(9, "מספר הטלפון חייב להכיל לפחות 9 מספרים")
      .max(10, "מספר הטלפון חייב להכיל עד 10 מספרים")
      .regex(/^[0-9]{9,10}$/, "מספר הטלפון לא תקין"),
  });

  const editForm = useForm({ resolver: zodResolver(editSchema) });
  const addForm = useForm({ resolver: zodResolver(addSchema) });

  type resEdit = z.infer<typeof editSchema>;
  type resAdd = z.infer<typeof addSchema>;

  const fetchRestaurants = async (page: number, search?: string) => {
    try {
      const res = await dispatch(getRestaurantsPage({ page, search })).unwrap();
      setRestaurants(res);
    } catch (error) {
      console.error(error);
    }
  };

  const editRes = async (data: resEdit) => {
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
                updateRestaurant({
                  id: restaurant!.id,
                  name: data.name?.trim() || restaurant!.name,
                  email: data.email?.trim() || restaurant!.email,
                  phone: data.phone?.trim() || restaurant!.phone,
                }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/restaurants");
            } catch (error: any) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: error.message,
                position: "bottom",
              });
              editForm.setError("name", {
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

  const delRes = async () => {
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
                deleteRestaurant(restaurant!.id),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/restaurants");
            } catch (error: any) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: error.message,
                position: "bottom",
              });
              editForm.setError("name", {
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

  const addRes = async (data: resAdd) => {
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
                createRestaurant({
                  name: data.name?.trim(),
                  email: data.email?.trim(),
                  phone: data.phone?.trim(),
                }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/restaurants");
            } catch (error: any) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: error.message,
                position: "bottom",
              });
              editForm.setError("name", {
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
    const delayDebounce = setTimeout(() => {
      fetchRestaurants(page, search.trim() !== "" ? search : undefined);
    }, 1000); // Debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  if (loading || restaurants === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>מסעדות</Text>
        <View style={styles.row}>
          <TextInput
            value={search}
            placeholder="חיפוש ..."
            style={styles.search}
            onChangeText={(text) => setSearch(text.trim())}
            placeholderTextColor="gray"
          />
          <CustomButton content="הוספה" onPress={() => setAddVisible(true)} />
        </View>
        <ResTable
          data={restaurants || []}
          page={page}
          setPage={setPage}
          onEdit={setModalVisible}
          setRes={setRestaurant}
        />
        <PopupModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditAble(false);
          }}
          title="עריכת מסעדה"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View>
              <Text>שם:</Text>
              <CustomInput
                control={editForm.control}
                name="name"
                placeholder={restaurant?.name}
                placeholderTextColor="black"
                editable={editAble}
                style={{ borderRadius: 20, marginTop: "2%" }}
              />
              <Text>אימייל:</Text>
              <CustomInput
                control={editForm.control}
                name="email"
                placeholder={restaurant?.email}
                placeholderTextColor="black"
                editable={editAble}
                style={{ borderRadius: 20, marginTop: "2%" }}
              />
              <Text>טלפון:</Text>
              <CustomInput
                control={editForm.control}
                name="phone"
                placeholder={restaurant?.phone}
                placeholderTextColor="black"
                editable={editAble}
                style={{ borderRadius: 20, marginTop: "2%" }}
                keyboardType="numeric"
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: "30%",
                paddingTop: "5%",
                justifyContent: "center",
              }}
            >
              {editAble ? (
                <Pressable
                  style={styles.textContainer}
                  onPress={() => setEditAble(!editAble)}
                >
                  <Text>ביטול עריכה</Text>
                  <Text>❌</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.textContainer}
                  onPress={() => setEditAble(!editAble)}
                >
                  <Text>עריכת פרטים</Text>
                  <Text>✍️</Text>
                </Pressable>
              )}
              <Pressable style={styles.textContainer} onPress={delRes}>
                <Text>מחיקת מסעדה</Text>
                <Text>❌</Text>
              </Pressable>
            </View>
            {editAble && (
              <CustomButton
                content="שמירה"
                onPress={editForm.handleSubmit(editRes)}
                style={styles.addButton}
              />
            )}
          </KeyboardAvoidingView>
        </PopupModal>
        <PopupModal
          visible={addVisible}
          onClose={() => {
            setAddVisible(false);
          }}
          title="הוספת מסעדה"
        >
          <View>
            <Text>שם:</Text>
            <CustomInput
              control={addForm.control}
              name="name"
              placeholder="שם המסעדה"
              placeholderTextColor="black"
              style={{ borderRadius: 20, marginTop: "2%" }}
            />
            <Text>אימייל:</Text>
            <CustomInput
              control={addForm.control}
              name="email"
              placeholder="אימייל"
              placeholderTextColor="black"
              style={{ borderRadius: 20, marginTop: "2%" }}
            />
            <Text>טלפון:</Text>
            <CustomInput
              control={addForm.control}
              name="phone"
              placeholder="טלפון"
              placeholderTextColor="black"
              style={{ borderRadius: 20, marginTop: "2%" }}
              keyboardType="numeric"
            />
          </View>
          <CustomButton
            content="הוספת מסעדה"
            onPress={addForm.handleSubmit(addRes)}
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
    padding: 20,
    gap: 20,
    marginTop: "10%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 20,
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
  addButton: {
    paddingVertical: 10,
    marginTop: "5%",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
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
});
