import ApproveTable from "@/components/tables/EditTable";
import {
  approvePending,
  deletePending,
  getAllPending,
} from "@/features/ingredients/ingredientsActions";
import { AppDispatch, RootState } from "@/store";
import { Ingredient } from "@/types/ingredient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

export default function AdminPendingScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [pending, setPending] = useState<Ingredient[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const { loading } = useSelector((state: RootState) => state.ingredients);
  const router = useRouter();

  const fetchPending = async (page: number) => {
    try {
      const res = await dispatch(getAllPending(page)).unwrap();
      setPending(res);
    } catch (error) {
      console.error(error);
    }
  };

  const onApprove = async (id: number, name: string) => {
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
                approvePending({ id, name }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/approveIngre");
            },
          },
        ],
        { cancelable: false }, // Optional: prevent closing the alert by tapping outside
      );
    } catch (error) {
      console.error(error);
    }
  };

  const onReject = async (id: number) => {
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
                deletePending({ id }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/approveIngre");
            },
          },
        ],
        { cancelable: false }, // Optional: prevent closing the alert by tapping outside
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPending(page);
  }, [page]);

  if (loading || pending === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>מרכיבים לאישור</Text>
        <ApproveTable
          onApprove={onApprove}
          onReject={onReject}
          page={page}
          setPage={setPage}
          data={pending || []}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
  },
});
