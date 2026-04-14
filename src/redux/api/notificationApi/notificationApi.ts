import { apiSlice } from "../apiSlice";
import { Notification } from "@/types/notification";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationsByCustomer: builder.query<Notification[], number>({
      query: (customerId) => `/notification/customer/${customerId}`,
      providesTags: ["Notification"],
    }),

    markAsSeen: builder.mutation<void, { id: number; customerId: number }>({
      query: ({ id, customerId }) => ({
        url: `/notification/${id}/seen/${customerId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
    
    createOfferNotification: builder.mutation<Notification, { title: string; message: string }>({
      query: (body) => ({
        url: `/notification/offer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),

    getAllNotifications: builder.query<Notification[], void>({
      query: () => `/notification`,
      providesTags: ["Notification"],
    }),

    getOfferNotifications: builder.query<Notification[], void>({
        query: () => `/notification/offers`,
        providesTags: ["Notification"],
    })
  }),
});

export const {
  useGetNotificationsByCustomerQuery,
  useMarkAsSeenMutation,
  useGetOfferNotificationsQuery,
  useCreateOfferNotificationMutation,
  useGetAllNotificationsQuery,
} = notificationApi;
