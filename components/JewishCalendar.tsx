// import PopupModal from "@/components/modals/PopUpModal";
import { getUserDishes } from "@/features/dish/dishActions";
import { AppDispatch, RootState } from "@/store";
import { Dish, MiniDish } from "@/types/dish";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "./CustomButton";
import DishCard from "./DishCard";
import ScrollModal from "./modals/ScrollModal";

interface CalendarProps {
  setShowDisplay: (bol: boolean) => void;
  setDish: (dish: MiniDish) => void;
}

export default function JewishCalendar({
  setShowDisplay,
  setDish,
}: CalendarProps) {
  const [markedDates, setMarkedDates] = useState({});
  const [holidayMap, setHolidayMap] = useState<Record<string, string>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.dish);
  const [dishes, setDishes] = useState<Dish[] | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  // Configure Hebrew locale
  LocaleConfig.locales["he"] = {
    monthNames: [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ],
    monthNamesShort: [
      "ינו",
      "פבר",
      "מרץ",
      "אפר",
      "מאי",
      "יונ",
      "יול",
      "אוג",
      "ספט",
      "אוק",
      "נוב",
      "דצמ",
    ],
    dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
    dayNamesShort: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
    today: "היום",
  };
  LocaleConfig.defaultLocale = "he";
  // Configure Hebrew locale
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get("https://www.hebcal.com/hebcal", {
          params: {
            v: "1",
            cfg: "json",
            maj: "on",
            min: "on",
            mod: "on",
            nx: "on",
            year: "now",
            month: "x",
            c: "on",
            geo: "none",
            m: 50,
          },
        });

        const marks: Record<string, any> = {};
        const holidayNames: Record<string, string> = {};

        response.data.items.forEach((item: any) => {
          if (item.category === "holiday") {
            const date = item.date.split("T")[0]; // ISO format: '2025-05-26'
            marks[date] = {
              marked: true,
              dotColor: "green",
              customStyles: {
                container: { backgroundColor: "#e6f0ff" },
                text: { color: "green", fontWeight: "bold" },
              },
            };
            holidayNames[date] = item.hebrew || item.title;
          }
        });

        setMarkedDates(marks);
        setHolidayMap(holidayNames);
      } catch (error) {
        console.error("Failed to fetch holidays:", error);
      }
    };

    fetchHolidays();
  }, []);

  const fetchDishes = async (page: number, search?: string) => {
    try {
      const res = await dispatch(getUserDishes({ page, search })).unwrap();
      setDishes(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!dishes) {
      fetchDishes(1);
    }
  }, [dishes]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDishes(page, search.trim() !== "" ? search : undefined);
    }, 1000); // Debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  const checkDate = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 1);
    if (twoDaysLater.getTime() > day.getTime()) {
      Alert.alert("ההזמנה חייבת להיות לפחות יומיים לפני");
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          if (checkDate(new Date(day.dateString))) {
            setModalVisible(true);
          }
        }}
        markedDates={markedDates}
        markingType={"custom"}
        renderArrow={(direction) => (
          <Text style={{ fontSize: 20 }}>
            {direction === "left" ? "»" : "«"}
          </Text>
        )}
        onDayLongPress={(day) => {
          const holidayName = holidayMap[day.dateString];
          if (holidayName) {
            Alert.alert(`${holidayName}`);
          } else {
            Alert.alert("אין חג בתאריך זה");
          }
        }}
      />
      <ScrollModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        title="התפריט שלי"
      >
        <TextInput
          value={search}
          placeholder="חיפוש ..."
          style={styles.search}
          onChangeText={(text) => setSearch(text.trim())}
          placeholderTextColor="gray"
        />
        {!dishes || dishes.length === 0 ? (
          <>
            <Text style={styles.text}>אין מנות להצגה</Text>
            <View style={{ alignItems: "center" }}>
              {dishes?.length === 0 && page > 1 && (
                <CustomButton
                  content="הקודם"
                  onPress={() => {
                    if (page > 1) setPage(page - 1);
                  }}
                />
              )}
              {dishes?.length === 0 && page < 1 && (
                <CustomButton content="הבא" onPress={() => setPage(page + 1)} />
              )}
            </View>
          </>
        ) : (
          <>
            {dishes &&
              dishes.length > 0 &&
              dishes.map((dish) => (
                <DishCard
                  key={dish.id}
                  imageUrl={dish.image}
                  title={dish.name}
                  price={dish.price}
                  description={dish.description}
                  restaurant={dish.restaurant.name}
                  onPress={() => {
                    setShowDisplay(true);
                    setDish({
                      name: dish.name,
                      image: dish.image,
                      price: dish.price,
                      description: dish.description,
                      id: dish.id,
                      restaurantId: dish.restaurant.id,
                      restaurant: dish.restaurant.name,
                      ingredients: dish.ingredients.map(
                        (ingres) => ingres.name,
                      ),
                      allergies: dish.allergies.map(
                        (allergie) => allergie.name,
                      ),
                    });
                  }}
                />
              ))}
            <View style={[styles.row, { gap: "40%", paddingTop: 10 }]}>
              <CustomButton
                content="הקודם"
                onPress={() => {
                  if (page > 1) setPage(page - 1);
                }}
              />
              <CustomButton content="הבא" onPress={() => setPage(page + 1)} />
            </View>
          </>
        )}
      </ScrollModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  search: {
    flex: 1,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "right",
    writingDirection: "rtl",
    marginHorizontal: 10,
    marginBottom: 10,
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
  text: {
    alignSelf: "center",
    marginBottom: 10,
  },
});
