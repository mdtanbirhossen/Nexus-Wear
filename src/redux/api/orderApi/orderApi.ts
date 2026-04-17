import { apiSlice } from "../apiSlice";
import { OrderResponse, Order } from "@/types/order";

export type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrderResponse, { page?: number; limit?: number; customerId?: string }>({
      query: (params) => ({
        url: "/order",
        params,
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<Order, string>({
      query: (id) => `/order/${id}`,
      providesTags: (result, error, id) => [{ type: "Order" as const, id }],
    }),

    createOrder: builder.mutation<Order, CreateOrder>({
      query: (data) => ({
        url: "/order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    updateOrder: builder.mutation<Order, { id: string; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `/order/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Order", { type: "Order", id }],
    }),

    deleteOrder: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
