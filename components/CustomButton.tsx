import {
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleSheet,
  Text,
  View,
} from "react-native";

type CustomButtonProps = {
  content: string;
  textStyle?: object;
  icon?: ImageSourcePropType; // optional icon
  iconStyle?: object; // optional icon styling
} & PressableProps;

export default function CustomButton(props: CustomButtonProps) {
  const { content, style, textStyle, icon, iconStyle, ...rest } = props;
  const combinedStyle =
    typeof style === "function"
      ? (state: PressableStateCallbackType) => [styles.button, style(state)]
      : style
      ? [styles.button, style]
      : styles.button;
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel || content}
      style={combinedStyle}
      {...rest}
    >
      <View style={styles.innerContainer}>
        {icon && (
          <Image
            source={icon}
            style={[styles.icon, iconStyle]}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.btnTxt, textStyle]}>{content}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4353fd",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  btnTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
