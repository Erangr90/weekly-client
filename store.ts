import { configureStore } from "@reduxjs/toolkit";
import allergyReducer from "./features/allergy/allergyReducer";
import authReducer from "./features/auth/authReducer";
import counterReducer from "./features/counter/counterSlice";
import ingredientsReducer from "./features/ingredients/ingredientsReducer";
import signUpReducer from "./features/signUpForm/signUpFormSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    signUp: signUpReducer,
    allergies: allergyReducer,
    ingredients: ingredientsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
