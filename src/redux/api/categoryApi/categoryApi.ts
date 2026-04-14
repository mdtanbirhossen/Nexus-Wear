import { apiSlice } from "../apiSlice";


export const categoryApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // categoryApi.ts
          getAllCategories: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string }) => ({
                    url: `/category`,
                    params,
               }),
               providesTags: ["Category"],
          }),


          getCategoryById: builder.query({
               query: (categoryId) => `/category/${categoryId}`
          }),

          deleteCategory: builder.mutation({
               query: (categoryId) => ({
                    url: `/category/${categoryId}`,
                    method: "DELETE",
               })
          }),

          createCategory: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/category',
                    method: "POST",
                    body: formData
               }),
               invalidatesTags: ["Category"],
          }),
          updateCategoryDetails: builder.mutation({
               query: ({ formData, categoryId }) => ({
                    url: `/category/${categoryId}`,
                    method: "PATCH",
                    body: formData
               }),
               invalidatesTags: ["Category"]
          }),


     }),
});

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery, useDeleteCategoryMutation, useCreateCategoryMutation, useUpdateCategoryDetailsMutation } = categoryApi;