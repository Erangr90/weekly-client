import { OrderItem } from "@/types/orderItem";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type Cart = {
  orderItems: OrderItem[];
};

export interface CartState {
  cart: Cart | undefined;
}

const initialState: CartState = {
  cart: undefined,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<OrderItem>) => {
      if (state.cart) {
        state.cart?.orderItems.push(action.payload);
      }
    },
    RemoveFormCart: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.orderItems = state.cart.orderItems.filter(
          (item) => item.dishId !== action.payload,
        );
      }
    },
    clearCart: (state) => {
      state.cart = undefined;
    },
    setCartSlice: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addToCart, RemoveFormCart, clearCart, setCartSlice } =
  cartSlice.actions;

export default cartSlice.reducer;
