import { StyleSheet, Text, View } from "react-native";

export default function DummyScreen() {
  return (
    <View style={styles.container}>
      <Text>Dummmyyyyyyy !!</Text>
    </View>
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
