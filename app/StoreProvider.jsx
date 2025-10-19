"use client";
import { useEffect, useRef } from "react";
import { Provider, useDispatch } from "react-redux";
import { makeStore } from "../lib/store";
import { loadUserFromCookies } from "@/lib/features/auth/authSlice";
function InitAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromCookies());
  }, [dispatch]);

  return null;
}
export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <InitAuth />
      {children}
    </Provider>
  );
}
