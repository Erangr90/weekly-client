import { User } from "@/types/users";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "../CustomButton";

interface TableProps {
  data: User[];
  page: number;
  setPage: (page: number) => void;
  onEdit: (show: boolean) => void;
  setUser: (user: User) => void;
}

export default function UsersTable(props: TableProps) {
  return (
    <>
      <View style={styles.container}>
        {!props.data || props.data.length === 0 ? (
          <Text style={styles.title}>אין משתמשים</Text>
        ) : (
          <ScrollView>
            <ScrollView horizontal>
              <View>
                {/* Header Row */}
                <View style={styles.headerRow}>
                  <Text key={1} style={[styles.cell, styles.headerCell]}>
                    שם
                  </Text>
                  <Text key={2} style={[styles.cell, styles.headerCell]}>
                    אימייל
                  </Text>
                  <Text key={3} style={[styles.cell, styles.headerCell]}>
                    אדמין
                  </Text>
                  <Text key={4} style={[styles.cell, styles.headerCell]}>
                    עריכה
                  </Text>
                </View>

                {/* Data Rows */}
                {props.data.map((item, rowIndex) => (
                  <View
                    key={rowIndex}
                    style={[
                      styles.row,
                      rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
                    ]}
                  >
                    <Text key={rowIndex + 99} style={styles.cell}>
                      {item.fullName}
                    </Text>
                    <Text key={rowIndex + 100} style={styles.cell}>
                      {item.email}
                    </Text>
                    <Text key={rowIndex + 101} style={styles.cell}>
                      {item.role === "ADMIN" ? "✅" : "❌"}
                    </Text>
                    <Pressable
                      key={rowIndex + 102}
                      onPress={() => {
                        props.onEdit(true);
                        props.setUser(item);
                      }}
                    >
                      <Text style={styles.cell}>✍️</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        )}

        <View style={[styles.row, { gap: "40%" }]}>
          <CustomButton
            content="הקודם"
            onPress={() => {
              if (props.page > 1) props.setPage(props.page - 1);
            }}
            disabled={props.page === 1}
          />
          <CustomButton
            content="הבא"
            onPress={() => props.setPage(props.page + 1)}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#228B22",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "flex-start",
    alignItems: "center",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: "3%",
    paddingBottom: 10,
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    // padding: "%",
    flex: 1,
    minWidth: 100,
    borderRightWidth: 1,
    borderRightColor: "#eee",
    color: "#333",
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: "20%",
  },
});
