import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "./authSlice";


const storage = {
 
  getItem: async (key) => {
    try {
      const value = localStorage.getItem(key);
      return value; // redux-persist expects the raw string or null
    } catch (error) {
      console.warn("storage.getItem error:", error);
      return null;
    }
  },

  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("storage.setItem error:", error);
    }
  },
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("storage.removeItem error:", error);
    }
  },
};

console.log("✅ Storage adapter initialized:", storage);
console.log("typeof storage.getItem:", typeof storage.getItem); // MUST be "function"


const authPersistConfig = {
  key: "auth",
  storage, // Pass our verified adapter
  whitelist: ["user", "accessToken", "refreshToken", "role", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
