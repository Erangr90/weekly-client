import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface SignUpState {
  fullName?: string | null;
  email?: string | null;
  password?: string | null;
  code?: string | null;
}

const initialState: SignUpState = {
  fullName: null,
  email: null,
  password: null,
  code: null,
};

export const SignUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFullName, setEmail, setPassword, setCode } =
  SignUpSlice.actions;

export default SignUpSlice.reducer;
