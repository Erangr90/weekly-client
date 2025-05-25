import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & TextInputProps;

export default function CustomInput<T extends FieldValues>(
  props: CustomInputProps<T>,
) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <TextInput
            {...props}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={[
              styles.input,
              props.style,
              { borderColor: error ? "crimson" : "#ccc" },
            ]}
          />
          <Text style={styles.error}>{error?.message}</Text>
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    textAlign: "right",
    writingDirection: "rtl",
  },
  error: {
    color: "crimson",
    minHeight: 16,
  },
  container: {
    gap: 5,
  },
});
