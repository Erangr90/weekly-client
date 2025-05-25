import { RootState } from "@/store";
import { Redirect, Slot } from "expo-router";
import { useSelector } from "react-redux";

export default function ProtectedLayout() {
  const { isLogin, user } = useSelector((state: RootState) => state.auth);

  if (isLogin && user !== null) {
    return <Slot />;
  } else {
    return <Redirect href={"/"} />;
  }
}
