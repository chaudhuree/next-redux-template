import baseApi from "./baseApi";

const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["logIn"]
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
    useAllUsersQuery, 
    useUserStatusUpdateMutation 
} = userApi;
