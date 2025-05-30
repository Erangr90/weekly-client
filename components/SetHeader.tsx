import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PopupModal from "./SetModal";
export default function SetHeader() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const setMenu: string[] = [
    "הפרופיל שלי",
    "עריכת עדיפויות",
    "אמצעי תשלום",
    "עריכת אלרגיות",
  ];
  const renderSetMenu = (
    <View style={styles.grid}>
      <TouchableOpacity
        key={3}
        onPress={() => router.push("/dontLike")}
        style={styles.gridItem}
      >
        <Text style={styles.text}>עריכת עדיפויות</Text>
      </TouchableOpacity>

      <TouchableOpacity
        key={5}
        onPress={() => router.push("/updateAllergies")}
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
          style={styles.navItem}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.navText}>הגדרות</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>זמנים</Text>
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
  },
});
