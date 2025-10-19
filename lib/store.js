import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "@/lib/features/counter/counterSlice";
import loggedReducer from "@/lib/features/logged/loggedSlice";
import authReducer from "@/lib/features/auth/authSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      logged: loggedReducer,
      auth: authReducer,
    },
  });
};
