import ApproveTable from "@/components/EditTable";
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
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

function TableScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [pending, setPending] = useState<Ingredient[] | undefined>(undefined);
  const { loading, error } = useSelector(
    (state: RootState) => state.ingredients,
  );
  const router = useRouter();

  const fetchPending = async () => {
    try {
      const res = await dispatch(getAllPending()).unwrap();
      setPending(res);
    } catch (error) {
      console.error(error);
    }
  };

  const onApprove = async (id: number, name: string) => {
    try {
      const { message } = await dispatch(approvePending({ id, name })).unwrap();
      console.log(message);
      Toast.show({ type: "success", text1: message, position: "bottom" });
      router.push("/approveIngre");
    } catch (error) {
      console.error(error);
    }
  };

  const onReject = async (id: number) => {
    try {
      const { message } = await dispatch(deletePending({ id })).unwrap();
      Toast.show({ type: "success", text1: message, position: "bottom" });
      router.push("/approveIngre");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!pending || pending === undefined) {
      fetchPending();
    }
  }, [pending]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    if (pending === undefined || pending.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>אין מרכיבים שממתינים לאישור</Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>מרכיבים לאישור</Text>
        <ApproveTable
          onApprove={onApprove}
          onReject={onReject}
          data={pending || []}
        />
      </SafeAreaView>
    );
  }
}

export default TableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 80,
  },
});
