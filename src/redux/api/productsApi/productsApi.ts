
import { Product } from "@/types/product";
import { apiSlice } from "../apiSlice";

export const productsApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // productsApi.ts
          getAllProducts: builder.query<{ data: Product[]; total: number; page: number; limit: number }, { 
               page?: number; 
               limit?: number; 
               search?: string; 
               status?: string;
               categoryId?: string;
               subcategoryId?: string;
               colorId?: string;
               sizeId?: string;
               minPrice?: number;
               maxPrice?: number;
          } | undefined>({
               query: (params) => ({
                    url: `/product`,
                    params,
               }),
               providesTags: ["Product"],
          }),

          getProductById: builder.query<Product, string>({
               query: (productId) => `/product/${productId}`
          }),

          deleteProduct: builder.mutation({
               query: (productId) => ({
                    url: `/product/${productId}`,
                    method: "DELETE",
               })
          }),

          createProduct: builder.mutation({
               query: (data) => ({
                    url: '/product',
                    method: 'POST',
                    body: data, // send JSON instead of FormData
                    headers: {
                         'Content-Type': 'application/json', // ensure JSON type
                    },
               }),
               invalidatesTags: ['Product'],
          }),

          updateProductDetails: builder.mutation({
               query: ({ data, productId }) => ({
                    url: `/product/${productId}`,
                    method: "PATCH",
                    body: data
               }),
               invalidatesTags: ["Product"]
          }),
     }),
});

export const { useGetAllProductsQuery, useGetProductByIdQuery, useDeleteProductMutation, useCreateProductMutation, useUpdateProductDetailsMutation } = productsApi;
