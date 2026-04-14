import { apiSlice } from "../apiSlice";


export const subCategoryApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // subCategoryApi.ts
          getAllSubCategories: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string; categoryId?: number }) => ({
                    url: `/subcategory`,
                    params,
               }),
               providesTags: ["SubCategory"],
          }),

          getSubCategoryById: builder.query({
               query: (subCategoryId) => `/subcategory/${subCategoryId}`
          }),

          deleteSubCategory: builder.mutation({
               query: (subCategoryId) => ({
                    url: `/subcategory/${subCategoryId}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["SubCategory"],
          }),


          
          createSubCategory: builder.mutation({
               query: (formData: FormData) => ({
                    url: '/subcategory',
                    method: "POST",
                    body: formData
               }),
               invalidatesTags: ["SubCategory"],
          }),
          updateSubCategoryDetails: builder.mutation({
               query: ({ formData, subCategoryId }) => ({
                    url: `/subcategory/${subCategoryId}`,
                    method: "PATCH",
                    body: formData
               }),
               invalidatesTags: ["SubCategory"]
          }),


     }),
});

export const { useGetAllSubCategoriesQuery, useGetSubCategoryByIdQuery, useDeleteSubCategoryMutation, useCreateSubCategoryMutation, useUpdateSubCategoryDetailsMutation } = subCategoryApi;