import { setUser, clearUser, setLoading, setError } from "./authSlice";

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await res.json();

    if (res.ok) {
      dispatch(setUser(data.user));
    } else {
      dispatch(setError(data.message || "Registration failed"));
    }
  } catch (err) {
    dispatch(setError("Network error"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(setError(null));
    dispatch(setLoading(true));
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    const data = await res.json();

    if (res.ok) {
      dispatch(setUser(data.user));
    } else {
      dispatch(setError(data.message));
    }
  } catch (err) {
    dispatch(setError("Network error"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const authenticateWithGoogle =
  ({ code, accountType, intent }) =>
  async (dispatch) => {
    try {
      dispatch(setError(null));
      dispatch(setLoading(true));
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            intent,
            ...(accountType ? { accountType } : {}),
          }),
          credentials: "include",
        }
      );
      const data = await res.json();

      if (res.ok) {
        dispatch(setUser(data.user));
      } else {
        dispatch(setError(data.message || "Google authentication failed"));
      }

      return { ok: res.ok, data };
    } catch (err) {
      dispatch(setError("Network error"));
      return { ok: false, data: { message: "Network error" } };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser = () => async (dispatch) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
  dispatch(clearUser());
};

export const checkAuth = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();

    if (res.ok) {
      dispatch(setUser(data.user));
    } else {
      dispatch(clearUser());
    }
  } catch {
    dispatch(clearUser());
  } finally {
    dispatch(setLoading(false));
  }
};
