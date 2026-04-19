import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authSlice";
import adminAuthReducer from "./features/adminAuthSlice";
import cartReducer from "./features/cart/cartSlice";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import getStorage from "@/lib/getStorage";

// Customer auth — persisted under key "auth"
const authPersistConfig = {
  key: "auth",
  storage: getStorage,
};

// Admin auth — persisted under a separate key "adminAuth"
const adminAuthPersistConfig = {
  key: "adminAuth",
  storage: getStorage,
};

// Cart — persisted under key "cart"
const cartPersistConfig = {
  key: "cart",
  storage: getStorage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAdminAuthReducer = persistReducer(adminAuthPersistConfig, adminAuthReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuthReducer,
    adminAuth: persistedAdminAuthReducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;