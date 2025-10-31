import api from "@/lib/axios";
import { setUser, clearUser, setLoading, setError } from "./authSlice";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/auth/signup", userData);
    dispatch(setUser(data.user));
  } catch (err) {
    const message = err.response?.data?.message || "Network error";
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const { data } = await api.post("/auth/signin", credentials);
    dispatch(setUser(data.user));
  } catch (err) {
    const message = err.response?.data?.message || "Network error";
    dispatch(setError(message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout failed:", err);
  }
  dispatch(clearUser());
};

export const checkAuth = () => async (dispatch) => {
  try {
    const { data } = await api.get("/auth/me");
    dispatch(setUser(data.user));
  } catch (err) {
    dispatch(clearUser());
  }
};
