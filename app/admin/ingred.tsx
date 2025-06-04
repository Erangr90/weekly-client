import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import PopupModal from "@/components/modals/PopUpModal";
import IngredTable from "@/components/tables/IngridTable";
import {
  createIngred,
  deleteIngred,
  getAllIngredPage,
  updateIngred,
} from "@/features/ingredients/ingredientsActions";
import { AppDispatch, RootState } from "@/store";
import { Ingredient } from "@/types/ingredient";
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
export default function AdminIngredScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [ingreds, setIngreds] = useState<Ingredient[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addShow, setAddShow] = useState(false);
  const [editAble, setEditAble] = useState(false);
  const { loading, error } = useSelector(
    (state: RootState) => state.ingredients,
  );
  const [ingred, setIngred] = useState<Ingredient | undefined>(undefined);
  const router = useRouter();

  const editNameSchema = z.object({
    name: z
      .string({ message: "שם האלרגיה הוא חובה" })
      .min(2, "שם האלרגיה חייב להכיל לפחות 2 תווים")
      .max(50, "שם האלרגיה יכול להכיל עד 50 תווים")
      .regex(
        /^[\u0590-\u05FF ]+$/,
        "שם האלרגיה יכול להכיל רק אותיות בעברית ורווחים",
      ),
  });
  const newNameSchema = z.object({
    name: z
      .string({ message: "שם האלרגיה הוא חובה" })
      .min(2, "שם האלרגיה חייב להכיל לפחות 2 תווים")
      .max(50, "שם האלרגיה יכול להכיל עד 50 תווים")
      .regex(
        /^[\u0590-\u05FF ]+$/,
        "שם האלרגיה יכול להכיל רק אותיות בעברית ורווחים",
      ),
  });

  const editForm = useForm({ resolver: zodResolver(editNameSchema) });
  const addForm = useForm({ resolver: zodResolver(newNameSchema) });

  type IngredEditName = z.infer<typeof editNameSchema>;
  type IngredNewName = z.infer<typeof newNameSchema>;

  const fetchIngreds = async (page: number, search?: string) => {
    try {
      const res = await dispatch(getAllIngredPage({ page, search })).unwrap();
      setIngreds(res);
    } catch (error) {
      console.error(error);
    }
  };

  const changeIngredName = async (data: IngredEditName) => {
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
                updateIngred({ id: ingred!.id, name: data.name }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/ingred");
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

  const addNewIngred = async (data: IngredNewName) => {
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
              router.push("/admin/ingred");
            } catch (error: any) {
              console.error(error);
              Toast.show({
                type: "error",
                text1: error.message,
                position: "bottom",
              });
              addForm.setError("name", {
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

  const delIngred = async () => {
    try {
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
              const { message } = await dispatch(
                deleteIngred(ingred!.id),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/ingred");
            },
          },
        ],
        { cancelable: false }, // Optional: prevent closing the alert by tapping outside
      );
    } catch (error: any) {
      console.error(error);
      Toast.show({ type: "error", text1: error.message, position: "bottom" });
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchIngreds(page, search.trim() !== "" ? search : undefined);
    }, 1000); // Debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  if (loading || ingreds === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>מרכיבים</Text>
        <View style={styles.row}>
          <TextInput
            value={search}
            placeholder="חיפוש ..."
            style={styles.search}
            onChangeText={(text) => setSearch(text.trim())}
            placeholderTextColor="gray"
          />
          <CustomButton
            content="הוספה"
            onPress={() => {
              setAddShow(true);
            }}
          />
        </View>
        <IngredTable
          data={ingreds || []}
          page={page}
          setPage={setPage}
          onEdit={setModalVisible}
          setAllergy={setIngred}
        />
        <PopupModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditAble(false);
          }}
          title="עריכת מרכיב"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View>
              <Text>שם:</Text>
              <CustomInput
                control={editForm.control}
                name="name"
                placeholder={ingred?.name}
                placeholderTextColor="black"
                editable={editAble}
                style={{ borderRadius: 20, marginTop: 10 }}
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
                  <Text>עריכת שם</Text>
                  <Text>✍️</Text>
                </Pressable>
              )}
              <Pressable style={styles.textContainer} onPress={delIngred}>
                <Text>מחיקת מרכיב</Text>
                <Text>❌</Text>
              </Pressable>
            </View>
            {editAble && (
              <CustomButton
                content="שמירה"
                onPress={editForm.handleSubmit(changeIngredName)}
                style={styles.addButton}
              />
            )}
          </KeyboardAvoidingView>
        </PopupModal>
        <PopupModal
          visible={addShow}
          onClose={() => setAddShow(false)}
          title="הוספת מרכיב חדש"
        >
          <CustomInput
            control={addForm.control}
            name="name"
            style={styles.addInput}
            placeholder="מרכיב חדש"
            placeholderTextColor="gray"
          />
          <CustomButton
            content="הוספה"
            onPress={addForm.handleSubmit(addNewIngred)}
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
