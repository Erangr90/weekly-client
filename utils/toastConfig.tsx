import React from "react";
import { DimensionValue, Text, View, ViewStyle } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const baseStyle: ViewStyle = {
  bottom: 10,
  left: 0,
  right: 0,
  alignItems: "center",
  zIndex: 9999,
  elevation: 10,
  marginBottom: "20%",
};

const toastBoxStyle = (
  borderColor: string,
  backgroundColor: string,
): ViewStyle => ({
  width: "90%" as DimensionValue,
  backgroundColor,
  borderColor,
  borderWidth: 1,
  padding: 10,
  borderRadius: 8,
  alignSelf: "center",
});

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View style={baseStyle}>
      <View style={toastBoxStyle("#D92D20", "#FEF3F2")}>
        {text1 && (
          <Text style={{ color: "#D92D20", fontWeight: "bold" }}>{text1}</Text>
        )}
        {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
      </View>
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View style={baseStyle}>
      <View style={toastBoxStyle("#12B76A", "#ECFDF3")}>
        {text1 && (
          <Text style={{ color: "#067647", fontWeight: "bold" }}>{text1}</Text>
        )}
        {text2 && <Text style={{ color: "black" }}>{text2}</Text>}
      </View>
    </View>
  ),
  delete: ({ text1, text2 }: CustomToastProps) => (
    <View style={baseStyle}>
      <View style={toastBoxStyle("#D92D20", "#FEF3F2")}>
        {text1 && (
          <Text style={{ color: "#D92D20", fontWeight: "bold" }}>{text1}</Text>
        )}
        {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
      </View>
    </View>
  ),
};

export default toastConfig;
