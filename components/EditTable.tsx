import { Ingredient } from "@/types/ingredient";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface TableProps {
  data: Ingredient[];
  onApprove: (id: number, name: string) => void;
  onReject: (id: number) => void;
}

export default function ApproveTable(props: TableProps) {
  return (
    <View style={styles.container}>
      <ScrollView>
        <ScrollView horizontal>
          <View>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <Text key={1} style={[styles.cell, styles.headerCell]}>
                שם
              </Text>
              <Text key={2} style={[styles.cell, styles.headerCell]}>
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
                <View
                  style={{
                    flexDirection: "row",
                    gap: "40%",
                    paddingTop: "5%",
                  }}
                >
                  <Pressable
                    onPress={() => props.onApprove(item.id, item.name)}
                  >
                    <Text>✅</Text>
                  </Pressable>
                  <Pressable onPress={() => props.onReject(item.id)}>
                    <Text>❌</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
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
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#f9f9f9",
  },
  cell: {
    padding: 12,
    minWidth: 100,
    borderRightWidth: 1,
    borderRightColor: "#eee",
    color: "#333",
  },
  headerCell: {
    fontWeight: "bold",
    color: "white",
  },
});
