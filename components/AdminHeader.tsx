import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function AdminHeader() {
  const router = useRouter();
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.navText}>פאנל ניהול</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // horizontal like <ul><li> horizontally
    backgroundColor: "#6495ED",
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    paddingHorizontal: 10,
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
});
