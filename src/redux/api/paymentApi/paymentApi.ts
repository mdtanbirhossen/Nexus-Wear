import { apiSlice } from "../apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        initiatePayment: builder.mutation<{ paymentUrl: string; transactionId?: string; message: string; }, any>({
            query: (data) => ({
                url: '/payment/initiate',
                method: 'POST',
                body: data,
            }),
        }),

        handleSuccess: builder.mutation<any, { transactionId: string }>({
             query: (data) => ({
                 url: `/payment/success?transactionId=${data.transactionId}`,
                 method: 'POST',
             }),
             invalidatesTags: ["Order"],
        }),

        handleFail: builder.mutation<any, { transactionId: string }>({
             query: (data) => ({
                 url: `/payment/fail?transactionId=${data.transactionId}`,
                 method: 'POST',
             }),
             invalidatesTags: ["Order"],
        }),
        
        handleCancel: builder.mutation<any, { transactionId: string }>({
             query: (data) => ({
                 url: `/payment/cancel?transactionId=${data.transactionId}`,
                 method: 'POST',
             }),
             invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useInitiatePaymentMutation,
    useHandleSuccessMutation,
    useHandleFailMutation,
    useHandleCancelMutation
} = paymentApi;
