import CustomButton from "@/components/CustomButton";
import {
  decrementQty,
  incrementQty,
  RemoveFormCart,
} from "@/features/cart/cartSlice";
import { AppDispatch, RootState } from "@/store";
import { formatDate } from "@/utils/dates";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function CartScreen() {
  const { cart } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const calculateTotalPrice = () => {
    const sum = cart?.orderItems.reduce((acc, currentItem) => {
      return acc + currentItem.totalPrice;
    }, 0);
    setTotalPrice(sum!);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cart]);

  if (!cart || cart.orderItems.length === 0) {
    router.push("/home");
  } else {
    return (
      <>
        <ScrollView horizontal>
          <View style={styles.container}>
            {cart && cart.orderItems.length > 0
              ? cart.orderItems.map((item) => (
                  <View key={item.dishId} style={styles.row}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <Text style={styles.text}>{item.name}</Text>
                    <View style={styles.qtyRow}>
                      <Pressable
                        style={{ marginLeft: 2 }}
                        onPress={() => {
                          dispatch(incrementQty(item.dishId));
                        }}
                      >
                        <Text style={styles.text}>+</Text>
                      </Pressable>
                      <TextInput
                        value={item.qty.toString()}
                        style={styles.qty}
                        placeholderTextColor="gray"
                      />
                      <Pressable
                        style={{ marginRight: 2 }}
                        onPress={() => {
                          if (item.qty > 1) {
                            dispatch(decrementQty(item.dishId));
                            return;
                          }
                          if (item.qty === 1)
                            dispatch(RemoveFormCart(item.dishId));
                        }}
                      >
                        <Text style={styles.text}>-</Text>
                      </Pressable>
                    </View>
                    <Text style={styles.text}>{item.restaurant}</Text>
                    <Text style={styles.text}>{item.totalPrice} ש"ח</Text>
                    <Text style={styles.text}>
                      {formatDate(new Date(item.shipDate))}
                    </Text>
                  </View>
                ))
              : null}
          </View>
        </ScrollView>
        <Text style={styles.total}>
          {"סך הכל: "}
          {totalPrice}
          {` ש"ח`}
        </Text>
        <View style={styles.btnWrap}>
          <CustomButton content="מעבר לתשלום" />
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 5,
  },
  image: {
    width: 60,
    height: 60,
    alignSelf: "center",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    paddingHorizontal: 12,
  },
  qtyRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
  },
  qty: {
    height: 40,
    width: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "center",
    fontSize: 12,
  },
  total: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "center",
  },
  btnWrap: {
    padding: 20,
    justifyContent: "center",
  },
});
