import CustomButton from "@/components/CustomButton";
import DishCard from "@/components/DishCard";
import { getDishesPage } from "@/features/dish/dishActions";
import { AppDispatch, RootState } from "@/store";
import { Dish } from "@/types/dish";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function AdminDishScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.dish);
  const [dishes, setDishes] = useState<Dish[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const fetchDishes = async (page: number, search?: string) => {
    try {
      const res = await dispatch(getDishesPage({ page, search })).unwrap();
      setDishes(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDishes(page, search.trim() !== "" ? search : undefined);
    }, 1000); // Debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  if (loading || dishes === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
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
          {!dishes || dishes.length === 0 ? (
            <Text style={styles.title}>אין מנות להצגה</Text>
          ) : (
            <View>
              {dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  imageUrl={dish.image}
                  title={dish.name}
                  price={dish.price}
                  description={dish.description}
                  restaurant={dish.restaurant.name}
                  // ingredients={dish.ingredients
                  //   .map((ingres) => ingres.name)
                  //   .join(", ")}
                  onPress={() =>
                    router.push({
                      pathname: `/admin/dish/[id]/edit`,
                      params: { id: dish.id.toString() },
                    })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
        <View style={[styles.row, { gap: "40%", paddingTop: "40%" }]}>
          <CustomButton
            content="הקודם"
            onPress={() => {
              if (page > 1) setPage(page - 1);
            }}
          />
          <CustomButton content="הבא" onPress={() => setPage(page + 1)} />
        </View>
      </SafeAreaView>
    );
  }
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
