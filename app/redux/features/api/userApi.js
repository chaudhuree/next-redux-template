import baseApi from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ page = 1, name = '' }) => ({
                url: `/users?page=${page}&name=${name}`,
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: 'PUT',
                body: { role },
            }),
            invalidatesTags: ['User'],
        }),
        updateUserStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/users/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        allUsers: builder.query({
            query: ({ page, limit, name }) => ({
                url: `/users?page=${page}&limit=${limit}&name=${name}`,
                method: "GET"
            }),
            providesTags: ["allUsers"]
        }),
        userStatusUpdate: builder.mutation({
            query: ({id, status}) => ({
                url: `/users/update-status/${id}`,
                method: "PUT",
                body: { status }
            }),
            invalidatesTags: ["allUsers"]
        })
    }),
});

export const { 
    useLoginUserMutation, 
    useGetUsersQuery,
    useUpdateUserRoleMutation,
    useUpdateUserStatusMutation,
    useDeleteUserMutation,
    useAllUsersQuery, 
    useUserStatusUpdateMutation 
} = userApi;
