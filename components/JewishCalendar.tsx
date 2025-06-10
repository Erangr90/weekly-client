// import PopupModal from "@/components/modals/PopUpModal";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

interface CalendarProps {
  setShipDate: (date: Date) => void;
  setModalVisible: (bol: boolean) => void;
}

export default function JewishCalendar({
  setModalVisible,
  setShipDate,
}: CalendarProps) {
  const [markedDates, setMarkedDates] = useState({});
  const [holidayMap, setHolidayMap] = useState<Record<string, string>>({});

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

  return (
    <SafeAreaView>
      <Calendar
        onDayPress={(day) => {
          if (checkDate(new Date(day.dateString))) {
            setModalVisible(true);
            setShipDate(new Date(day.dateString));
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
