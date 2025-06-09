import CustomButton from "@/components/CustomButton";
import JewishCalendar from "@/components/JewishCalendar";
import PopupModal from "@/components/modals/PopUpModal";
import { addToCart } from "@/features/cart/cartSlice";
import { AppDispatch, RootState } from "@/store";
import { MiniDish } from "@/types/dish";
import { saveCartToStorage } from "@/utils/asyncStorage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

export default function HomeScreen() {
  const [showDisplay, setShowDisplay] = useState(false);
  const [showQty, setShowQty] = useState(false);
  const [dish, setDish] = useState<MiniDish | undefined>(undefined);
  const [qty, setQty] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { cart } = useSelector((state: RootState) => state.cart);

  const onAddQty = (qty: number) => {
    if (qty < 0 || qty === 0) {
      setQty(0);
      return;
    } else if (qty > 0) {
      setQty(qty);
    }
  };

  const onOrder = async () => {
    if (!dish || qty === 0) {
      Alert.alert("פרטי ההזמנה שגויים");
      return;
    }
    let order = cart?.orderItems.find((item) => item.dishId === dish.id);
    if (order) {
      order.qty += qty;
      order.price = order.qty * dish.price;
      dispatch(addToCart(order));
    } else {
      dispatch(
        addToCart({
          name: dish.name,
          qty: qty,
          image: dish.image,
          price: dish.price * qty,
          dishId: dish.id,
          restaurantId: dish.restaurantId,
          restaurant: dish.restaurant,
        }),
      );
    }
    try {
      setDish(undefined);
      setQty(0);
      setShowQty(false);
      setShowDisplay(false);
      Toast.show({
        type: "success",
        text1: "ההזמנה נוספה בהצלחה",
        position: "bottom",
      });
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   clearCartFromStorage();
  //   dispatch(clearCart());
  // });

  useEffect(() => {
    if (cart) {
      saveCartToStorage(cart);
    }
  }, [cart]);

  return (
    <>
      <View style={styles.container}>
        <JewishCalendar setShowDisplay={setShowDisplay} setDish={setDish} />
      </View>
      <PopupModal
        visible={showDisplay}
        onClose={() => setShowDisplay(false)}
        title="פרטי המנה"
      >
        <Text style={styles.title}>{dish?.name}</Text>
        <Image source={{ uri: dish?.image }} style={styles.image} />
        <Text style={styles.title}>{dish?.restaurant}</Text>
        <Text style={styles.text} numberOfLines={5}>
          {dish?.description}
        </Text>
        <Text style={styles.text} numberOfLines={3}>
          <Text style={styles.title}>{"מרכיבים: "}</Text>
          {dish?.ingredients.join(", ")}
        </Text>
        <Text style={styles.text} numberOfLines={3}>
          <Text style={styles.title}>{"מתאים לאלרגנים של: "}</Text>
          {dish?.allergies.join(", ")}
        </Text>
        <Text style={styles.title}>
          {dish?.price}
          {` ש"ח`}
        </Text>
        <CustomButton
          style={styles.button}
          content="הזמנה"
          onPress={() => setShowQty(true)}
        />
      </PopupModal>
      <PopupModal
        visible={showQty}
        onClose={() => setShowQty(false)}
        title="כמות"
      >
        <View style={styles.row}>
          <Pressable onPress={() => onAddQty(qty + 1)}>
            <Text>+</Text>
          </Pressable>
          <TextInput
            value={qty.toString()}
            placeholder="חיפוש ..."
            style={styles.qty}
            onChangeText={(text) => setQty(parseInt(text.trim()))}
            placeholderTextColor="gray"
          />
          <Pressable onPress={() => onAddQty(qty - 1)}>
            <Text>-</Text>
          </Pressable>
        </View>
        <CustomButton style={styles.button} content="הזמן" onPress={onOrder} />
      </PopupModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
  display: {
    gap: 10,
  },
  button: {
    padding: 11,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 20,
    gap: 20,
  },
  qty: {
    height: 50,
    width: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    writingDirection: "rtl",
  },
});
