import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  currentUser: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.push(action.payload);
      localStorage.setItem("users", JSON.stringify(users));
      state.currentUser = action.payload;
      state.isLoggedIn = true;
      Cookies.set("authUser", JSON.stringify(action.payload), { expires: 7 });
    },
    loginUser: (state, action) => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) =>
          u.email === action.payload.email &&
          u.password === action.payload.password
      );

      if (user) {
        state.currentUser = user;
        state.isLoggedIn = true;

        Cookies.set("authUser", JSON.stringify(user), { expires: 7 });
      } else {
        alert("Invalid username or password");
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      Cookies.remove("authUser");
    },
    loadUserFromCookies: (state) => {
      const cookie = Cookies.get("authUser");
      if (cookie) {
        const user = JSON.parse(cookie);
        state.currentUser = user;
        state.isLoggedIn = true;
      }
    },
  },
});

export const { registerUser, loginUser, logoutUser, loadUserFromCookies } =
  authSlice.actions;

export default authSlice.reducer;
