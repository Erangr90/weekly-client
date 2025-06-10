import CustomButton from "@/components/CustomButton";
import DishCard from "@/components/DishCard";
import JewishCalendar from "@/components/JewishCalendar";
import PopupModal from "@/components/modals/PopUpModal";
import ScrollModal from "@/components/modals/ScrollModal";
import { addToCart } from "@/features/cart/cartSlice";
import { getUserDishes } from "@/features/dish/dishActions";
import { AppDispatch, RootState } from "@/store";
import { Dish, MiniDish } from "@/types/dish";
import { saveCartToStorage } from "@/utils/asyncStorage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const [dishes, setDishes] = useState<Dish[] | undefined>(undefined);
  const [qty, setQty] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [shipDate, setShipDate] = useState<Date | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { cart } = useSelector((state: RootState) => state.cart);
  const { loading } = useSelector((state: RootState) => state.dish);

  const onAddQty = (qty: number) => {
    if (qty < 0 || qty === 0) {
      setQty(0);
      return;
    } else if (qty > 0) {
      setQty(qty);
    }
  };

  const onOrder = async () => {
    if (!dish || qty === 0 || !shipDate) {
      Alert.alert("פרטי ההזמנה שגויים");
      return;
    }
    let order = cart?.orderItems.find((item) => item.dishId === dish.id);
    if (order) {
      order.qty += qty;
      order.dishPrice = order.qty * dish.price;
      dispatch(addToCart(order));
    } else {
      dispatch(
        addToCart({
          name: dish.name,
          qty: qty,
          image: dish.image,
          dishPrice: dish.price,
          totalPrice: dish.price * qty,
          dishId: dish.id,
          restaurantId: dish.restaurantId,
          restaurant: dish.restaurant,
          shipDate: shipDate.toISOString(),
        }),
      );
    }
    setDish(undefined);
    setQty(0);
    setShowQty(false);
    setShowDisplay(false);
    setModalVisible(false);
    Toast.show({
      type: "success",
      text1: "ההזמנה נוספה בהצלחה",
      position: "bottom",
    });
  };

  const fetchDishes = async (page: number, search?: string) => {
    try {
      const res = await dispatch(getUserDishes({ page, search })).unwrap();
      setDishes(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!dishes) {
      fetchDishes(1);
    }
  }, [dishes]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDishes(page, search.trim() !== "" ? search : undefined);
    }, 1000); // Debounce time in ms

    return () => clearTimeout(delayDebounce);
  }, [search, page]);

  useEffect(() => {
    if (cart) {
      saveCartToStorage(cart);
    }
  }, [cart]);

  if (!dishes) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.container}>
          <JewishCalendar
            setModalVisible={setModalVisible}
            setShipDate={setShipDate}
          />
        </View>
        <ScrollModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
          }}
          title="התפריט שלי"
        >
          <TextInput
            value={search}
            placeholder="חיפוש ..."
            style={styles.search}
            onChangeText={(text) => setSearch(text.trim())}
            placeholderTextColor="gray"
          />
          {!dishes || dishes.length === 0 ? (
            <>
              <Text style={styles.text}>אין מנות להצגה</Text>
              <View style={{ alignItems: "center" }}>
                {dishes?.length === 0 && page > 1 && (
                  <CustomButton
                    content="הקודם"
                    onPress={() => {
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                )}
                {dishes?.length === 0 && page < 1 && (
                  <CustomButton
                    content="הבא"
                    onPress={() => setPage(page + 1)}
                  />
                )}
              </View>
            </>
          ) : (
            <>
              {dishes &&
                dishes.length > 0 &&
                dishes.map((dish) => (
                  <DishCard
                    key={dish.id}
                    imageUrl={dish.image}
                    title={dish.name}
                    price={dish.price}
                    description={dish.description}
                    restaurant={dish.restaurant.name}
                    onPress={() => {
                      setShowDisplay(true);
                      setDish({
                        name: dish.name,
                        image: dish.image,
                        price: dish.price,
                        description: dish.description,
                        id: dish.id,
                        restaurantId: dish.restaurant.id,
                        restaurant: dish.restaurant.name,
                        ingredients: dish.ingredients.map(
                          (ingres) => ingres.name,
                        ),
                        allergies: dish.allergies.map(
                          (allergie) => allergie.name,
                        ),
                      });
                    }}
                  />
                ))}
              <View style={[styles.row, { gap: "40%", paddingTop: 10 }]}>
                <CustomButton
                  content="הקודם"
                  onPress={() => {
                    if (page > 1) setPage(page - 1);
                  }}
                />
                <CustomButton content="הבא" onPress={() => setPage(page + 1)} />
              </View>
            </>
          )}
        </ScrollModal>
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
              style={styles.qty}
              onChangeText={(text) => setQty(parseInt(text.trim()))}
              placeholderTextColor="gray"
            />
            <Pressable onPress={() => onAddQty(qty - 1)}>
              <Text>-</Text>
            </Pressable>
          </View>
          <CustomButton
            style={styles.button}
            content="הזמן"
            onPress={onOrder}
          />
        </PopupModal>
      </>
    );
  }
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
  search: {
    flex: 1,
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    textAlign: "right",
    writingDirection: "rtl",
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
