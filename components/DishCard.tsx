import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DishCardProps = {
  // imageUrl: ImageSourcePropType;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  restaurant: string;
  ingredients?: string;
  onPress?: () => void;
};

function DishCard(props: DishCardProps) {
  const {
    imageUrl,
    title,
    description,
    onPress,
    price,
    restaurant,
    ingredients,
  } = props;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      {/* <Image source={imageUrl} style={styles.image} /> */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{restaurant}</Text>
        <Text style={styles.description} numberOfLines={5}>
          {description}
        </Text>
        {/* <Text style={styles.description} numberOfLines={3}>
          {ingredients}
        </Text> */}
        <Text style={styles.description}>
          {price.toFixed(2)}
          {` ש"ח`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  image: {
    width: "45%",
    // maxHeight:100,
    // height: "40%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 10,
    color: "#666",
  },
});

export default DishCard;
