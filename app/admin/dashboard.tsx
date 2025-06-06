import { getAllPendingLen } from "@/features/ingredients/ingredientsActions";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
export default function DashboardScreen() {
  const [pendingLen, setPendingLen] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.ingredients,
  );

  const router = useRouter();

  const getPendingLen = async () => {
    try {
      const { len } = await dispatch(getAllPendingLen()).unwrap();
      setPendingLen(len);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pendingLen === undefined) {
      getPendingLen();
    }
  }, [pendingLen]);

  const renderMenu = (
    <View style={styles.grid}>
      <TouchableOpacity
        key={1}
        onPress={() => router.push("/admin/approveIngre")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>
          {`אישור מרכיבים`}
          {`\n`}
          {`(${pendingLen})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={3}
        onPress={() => router.push("/admin/users")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>משתמשים</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={4}
        onPress={() => router.push("/admin/allergies")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>אלרגיות</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={6}
        onPress={() => router.push("/admin/ingred")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>מרכיבים</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={2}
        onPress={() => router.push("/admin/dishes")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>מנות</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={5}
        onPress={() => router.push("/admin/restaurants")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>מסעדות</Text>
      </TouchableOpacity>
    </View>
  );
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.container}>
          <Text style={styles.title}>פאנל ניהול</Text>
          <View style={styles.header}>{renderMenu}</View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // horizontal like <ul><li> horizontally
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  navItem: {
    paddingHorizontal: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    height: 270,
  },
  gridItem: {
    width: 90, // fixed width
    height: 90, // fixed height (same as width)
    borderRadius: 10, // half of width/height for a perfect circle
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: "#228B22", // spacing between items
  },
  text: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
