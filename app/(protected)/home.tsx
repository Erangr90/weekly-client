import CustomButton from "@/components/CustomButton";
import { logout } from "@/features/auth/authActions";
import { getUsers } from "@/features/users/usersActions";
import { AppDispatch, RootState } from "@/store";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function HomeScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const onGetUsers = async () => {
    try {
      const users = await dispatch(getUsers()).unwrap();
      console.log(users);
    } catch (error) {
      console.error(error);
    }
  };

  const onLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>ברוך הבא {user?.fullName}</Text>
      <CustomButton content="get users" onPress={onGetUsers} />
      <CustomButton content="logout" onPress={onLogout} />
      <Link href={"/dummy"}> Dummmy</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
});
