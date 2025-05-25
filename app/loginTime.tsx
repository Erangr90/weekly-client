import { logout } from "@/features/auth/authActions";
import { AppDispatch } from "@/store";
import { getExTime } from "@/utils/secureStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function LoginTime() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const checkExTime = async () => {
    const exTime = await getExTime();
    const currentTime = new Date().getTime();
    if (exTime) {
      if (currentTime > exTime) {
        await dispatch(logout()).unwrap();
        router.replace("/");
      }
    } else {
      await dispatch(logout()).unwrap();
      router.replace("/");
    }
  };

  useEffect(() => {
    checkExTime();
  }, []);

  return null;
}
