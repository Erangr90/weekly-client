import { configureStore } from "@reduxjs/toolkit";
import allergyReducer from "./features/allergy/allergyReducer";
import authReducer from "./features/auth/authReducer";
import cartReducer from "./features/cart/cartSlice";
import counterReducer from "./features/counter/counterSlice";
import dishReducer from "./features/dish/dishReducer";
import ingredientsReducer from "./features/ingredients/ingredientsReducer";
import restaurantsReducer from "./features/restaurants/restaurantsReducer";
import signUpReducer from "./features/signUpForm/signUpFormSlice";
import uploadReducer from "./features/uploads/uploadReducer";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    signUp: signUpReducer,
    allergies: allergyReducer,
    ingredients: ingredientsReducer,
    restaurants: restaurantsReducer,
    dish: dishReducer,
    upload: uploadReducer,
    cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
