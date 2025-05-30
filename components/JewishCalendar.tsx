import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

export default function JewishCalendar() {
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

  return (
    <Calendar
      onDayPress={(day) => {
        console.log("selected day", day);
      }}
      markedDates={markedDates}
      markingType={"custom"}
      renderArrow={(direction) => (
        <Text style={{ fontSize: 20 }}>{direction === "left" ? "»" : "«"}</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
});
