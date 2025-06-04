import Heder from "@/components/Header";
import { RootState } from "@/store";
import { Redirect, Slot } from "expo-router";
import { useSelector } from "react-redux";

export default function AdminLayout() {
  const { isLogin, user } = useSelector((state: RootState) => state.auth);

  if (isLogin && user !== undefined && user.role === "ADMIN") {
    return (
      <>
        <Heder />
        <Slot />
      </>
    );
  } else if (isLogin && user !== undefined) {
    return <Redirect href={"/home"} />;
  } else {
    return <Redirect href={"/"} />;
  }
}
