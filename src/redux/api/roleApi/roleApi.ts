import { apiSlice } from "../apiSlice";


export const roleApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          getAllRoles: builder.query({
               query: (params?: { page?: number; limit?: number; search?: string; status?: string }) => ({
                    url: `/role`,
                    params,
               }),
               providesTags: ["Role"],
          }),

          getRoleById: builder.query({
               query: (roleId) => `/role/${roleId}`
          }),

          deleteRole: builder.mutation({
               query: (roleId) => ({
                    url: `/role/${roleId}`,
                    method: "DELETE",
               }),
               invalidatesTags: ["Role"]
          }),

          createRole: builder.mutation({
               query: (data: { name: string; description: string }) => ({
                    url: '/role',
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: data,
               }),
               invalidatesTags: ['Role'],
          }),

          updateRoleDetails: builder.mutation({
               query: ({ roleId, ...data }: { roleId: string; name: string; description: string }) => ({
                    url: `/role/${roleId}`,
                    method: 'PATCH',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: data,
               }),
               invalidatesTags: ['Role'],
          }),

     })
})


export const { useGetAllRolesQuery, useGetRoleByIdQuery, useDeleteRoleMutation, useCreateRoleMutation, useUpdateRoleDetailsMutation, } = roleApi

