import PopupModal from "@/components/modals/PopUpModal";
import UsersTable from "@/components/tables/UsersTable";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "@/features/auth/authActions";
import { AppDispatch, RootState } from "@/store";
import { User } from "@/types/users";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

export default function AdminUsersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | undefined>(undefined);
  const router = useRouter();

  const fetchUsers = async (page: number, search?: string) => {
    try {
      const res = await dispatch(getAllUsers({ page, search })).unwrap();
      setUsers(res);
    } catch (error) {
      console.error(error);
    }
  };

  const changeUserRole = async (id: number, role: string) => {
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
                updateUserRole({ id, role }),
              ).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/users");
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

  const delUser = async (id: number) => {
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
              const { message } = await dispatch(deleteUser(id)).unwrap();
              Toast.show({
                type: "success",
                text1: message,
                position: "bottom",
              });
              router.push("/admin/users");
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
      fetchUsers(page, search.trim() !== "" ? search : undefined);
    }, 1000); // Debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  if (loading || users === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>משתמשים</Text>
        <View style={styles.row}>
          <TextInput
            value={search}
            placeholder="חיפוש ..."
            style={styles.search}
            onChangeText={(text) => setSearch(text.trim())}
            placeholderTextColor="gray"
          />
        </View>
        <UsersTable
          data={users || []}
          page={page}
          setPage={setPage}
          onEdit={setModalVisible}
          setUser={setUser}
        />
        <PopupModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title="עריכת משתמש"
        >
          <View>
            <Text>שם: {user?.fullName}</Text>
            <Text>אימייל: {user?.email}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: "30%",
              paddingTop: "5%",
              justifyContent: "center",
            }}
          >
            {user?.role === "ADMIN" ? (
              <Pressable
                style={styles.textContainer}
                onPress={() => {
                  changeUserRole(user.id, "USER");
                }}
              >
                <>
                  <Text>ביטול הרשאת אדמין</Text>
                  <Text>❌</Text>
                </>
              </Pressable>
            ) : (
              <Pressable
                style={styles.textContainer}
                onPress={() => {
                  changeUserRole(user!.id, "ADMIN");
                }}
              >
                <>
                  <Text>מתן הרשאת אדמין</Text>
                  <Text>✅</Text>
                </>
              </Pressable>
            )}
            <Pressable
              style={styles.textContainer}
              onPress={() => delUser(user!.id)}
            >
              <Text>מחק משתמש</Text>
              <Text>❌</Text>
            </Pressable>
          </View>
        </PopupModal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 10,
    gap: 20,
    marginTop: "5%",
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
    marginTop: 2,
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
    paddingVertical: 11,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
