// PopupModal.tsx
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
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
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.text}>{title}</Text>
          <View style={styles.centerContent}>{children}</View>

          <CustomButton
            content="סגירה"
            onPress={onClose}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
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
    height: "50%",
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
  },
});
