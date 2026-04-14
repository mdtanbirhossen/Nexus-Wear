// Merged apiSlice — covers both customer storefront and admin panel
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../features/adminAuthSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    // Admin token takes priority; fall back to customer token
    const token = state.adminAuth?.token ?? state.auth?.token ?? null;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    // Customer tags
    "auth",
    "customer",
    // Admin tags
    "Admin",
    "Category",
    "SubCategory",
    "Role",
    "Color",
    "Size",
    "Product",
    "Notification",
    "Order"
  ],
  endpoints: () => ({}),
});
