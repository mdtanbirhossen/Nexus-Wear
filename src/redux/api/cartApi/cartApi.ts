import { apiSlice } from "../apiSlice";
import { Cart, CartItem } from "@/types/cart";

export const cartApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<Cart, void>({
            query: () => `/cart`,
            providesTags: ["customer"], // Assuming cache tag for customer cart
        }),

        getCartByCustomerId: builder.query<Cart, string>({
             query: (customerId) => `/cart/customer/${customerId}`,
             providesTags: ["customer"],
        }),

        getCartBySessionId: builder.query<Cart, string>({
             query: (sessionId) => `/cart/session/${sessionId}`,
             providesTags: ["customer"],
        }),

        addCartItem: builder.mutation<Cart, Partial<CartItem> & { sessionId?: string; customerId?: string }>({
             query: (data) => ({
                 url: '/cart/item',
                 method: 'POST',
                 body: data,
             }),
             invalidatesTags: ["customer"],
        }),

        updateCartItem: builder.mutation<Cart, { itemId: string; quantity: number }>({
             query: ({ itemId, quantity }) => ({
                 url: `/cart/item/${itemId}`,
                 method: 'PATCH',
                 body: { quantity },
             }),
             invalidatesTags: ["customer"],
        }),

        deleteCartItem: builder.mutation<Cart, string>({
             query: (itemId) => ({
                 url: `/cart/item/${itemId}`,
                 method: 'DELETE',
             }),
             invalidatesTags: ["customer"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useGetCartByCustomerIdQuery,
    useGetCartBySessionIdQuery,
    useAddCartItemMutation,
    useUpdateCartItemMutation,
    useDeleteCartItemMutation
} = cartApi;
