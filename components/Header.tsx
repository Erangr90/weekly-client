import { logout } from "@/features/auth/authActions";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PopupModal from "./SetModal";

export default function AdminHeader() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const renderSetMenu = (
    <View style={styles.grid}>
      <TouchableOpacity
        key={3}
        onPress={() => {
          router.push("/dontLike");
          setModalVisible(false);
        }}
        style={styles.gridItem}
      >
        <Text style={styles.text}>עריכת עדיפויות</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={5}
        onPress={() => {
          router.push("/updateAllergies");
          setModalVisible(false);
        }}
        style={styles.gridItem}
      >
        <Text style={styles.text}>עריכת אלרגיות</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          key={1}
          style={[styles.navItem, { alignSelf: "flex-start" }]}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.navText}>Weekly</Text>
        </TouchableOpacity>

        {user?.role === "ADMIN" && (
          <TouchableOpacity
            key={2}
            style={[styles.navItem, { alignSelf: "flex-start" }]}
            onPress={() => router.push("/dashboard")}
          >
            <Text style={styles.navText}>פאנל ניהול</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          key={3}
          onPress={() => console.log("הפרופיל שלי")}
          style={styles.navItem}
        >
          <Text style={styles.text}>הפרופיל שלי</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={4}
          onPress={() => setModalVisible(true)}
          style={styles.navItem}
        >
          <Text style={styles.text}>הגדרות</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={5}
          onPress={() => console.log("זמנים")}
          style={styles.navItem}
        >
          <Text style={styles.text}>זמנים</Text>
        </TouchableOpacity>

        <TouchableOpacity
          key={6}
          onPress={async () => dispatch(logout()).unwrap()}
          style={styles.navItem}
        >
          <Text style={styles.text}>התנתקות</Text>
        </TouchableOpacity>
      </View>
      <PopupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="הגדרות"
      >
        {renderSetMenu}
      </PopupModal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // horizontal like <ul><li> horizontally
    backgroundColor: "#228B22",
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    paddingHorizontal: 5,
  },
  navText: {
    color: "#fff",
    fontSize: 13,
  },
  text: {
    color: "#fff",
    fontSize: 13,
  },
  navItemText: {
    paddingHorizontal: 10,
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
});
