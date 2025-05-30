// PopupModal.tsx
import { RootState } from "@/store";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import CustomButton from "./CustomButton";

interface PopupModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const PopupModal: React.FC<PopupModalProps> = ({
  visible,
  onClose,
  title = "This is a popup!",
  children,
}) => {
  const { loading } = useSelector((state: RootState) => state.ingredients);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.overlay}
        >
          <View style={styles.popup}>
            <Text style={styles.text}>{title}</Text>
            <View style={styles.content}>{children}</View>
            <CustomButton
              content="סגירה"
              onPress={onClose}
              style={styles.button}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
};

export default PopupModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: "90%", // instead of fixed 400
    maxHeight: "80%", // allow room for keyboard
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    marginBottom: 90,
    fontWeight: "600",
    alignSelf: "center",
  },
  button: {
    padding: 10,
    marginTop: 15,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // center all content inside
    gap: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 20,
  },
});
