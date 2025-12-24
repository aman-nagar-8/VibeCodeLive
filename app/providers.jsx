"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "@/lib/apiClient";
import { setAccessToken } from "@/lib/apiClient";
import { setUser, clearUser } from "@/store/userSlice";

export function AuthBootstrapc({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // 1️⃣ Try refreshing access token using cookie
        const refreshRes = await fetch("/api/login/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) throw new Error();

        const { accessToken } = await refreshRes.json();

        // 2️⃣ Set access token in api client
          setAccessToken(accessToken);
        
        // 3️⃣ Fetch current user
        const me = await api.get("/getUser" );
        // 4️⃣ Store user globally
        dispatch(setUser(me.data.user));
      } catch {
        dispatch(clearUser());
      }
    };

    restoreSession();
  }, [dispatch]);

  return children;
}


import { Provider } from "react-redux";
import { store } from "../store";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
