import { apiSlice } from "../apiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddressByCustomerId: builder.query({
      query: (customerId: string) => ({
        url: `/address/customer/${customerId}`,
        method: "GET",
      }),
      providesTags: ["Address"],
    }),
    saveCustomerAddress: builder.mutation({
      query: ({ customerId, data }: { customerId: string; data: any }) => ({
        url: `/address/customer/${customerId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const { useGetAddressByCustomerIdQuery, useSaveCustomerAddressMutation } = addressApi;
