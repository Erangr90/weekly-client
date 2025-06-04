import { Allergy } from "@/types/allergy";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import CustomButton from "./CustomButton";

interface TableProps {
  data: Allergy[];
  page: number;
  setPage: (page: number) => void;
  onEdit: (show: boolean) => void;
  setAllergy: (user: Allergy) => void;
}

export default function AllergiesTable(props: TableProps) {
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <ScrollView horizontal>
            <View>
              {/* Header Row */}
              <View style={styles.headerRow}>
                <Text key={1} style={[styles.cell, styles.headerCell]}>
                  שם
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
                    {item.name}
                  </Text>
                  <Pressable
                    key={rowIndex + 102}
                    onPress={() => {
                      props.onEdit(true);
                      props.setAllergy(item);
                    }}
                  >
                    <Text>✍️</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
        <View style={[styles.row, { gap: "40%", paddingTop: "40%" }]}>
          <CustomButton
            content="הקודם"
            onPress={() => props.setPage(props.page - 1)}
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
  },
  row: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 10,
    gap: "20%",
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    padding: "20%",
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
    alignSelf: "center",
  },
});
