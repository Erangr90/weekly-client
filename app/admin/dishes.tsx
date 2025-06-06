import CustomButton from "@/components/CustomButton";
import DishCard from "@/components/DishCard";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AdminDishScreen() {
  const dishes = [
    {
      id: 1,
      name: "פיתה שאוורמה",
      price: 50,
      description: "המנה הכי טעימה בעולם",
      restaurant: {
        name: "התימני",
      },
    },
  ];
  const pita = require("@/assets/images/pita.jpeg");
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>מנות</Text>
      <View style={styles.row}>
        <TextInput
          value={search}
          placeholder="חיפוש ..."
          style={styles.search}
          onChangeText={(text) => setSearch(text.trim())}
          placeholderTextColor="gray"
        />
        <CustomButton
          content="הוספה"
          onPress={() => router.push("/admin/addDish")}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DishCard
          imageUrl={pita}
          title={dishes[0].name}
          price={dishes[0].price}
          description={dishes[0].description}
          restaurant={dishes[0].restaurant.name}
        />
      </ScrollView>
      <View style={[styles.row, { gap: "40%", paddingTop: "40%" }]}>
        <CustomButton content="הקודם" onPress={() => console.log("page-1")} />
        <CustomButton content="הבא" onPress={() => console.log("page+1")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: "5%",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    gap: 20,
    paddingHorizontal: 20,
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
});
