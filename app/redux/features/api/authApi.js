import { baseApi } from './baseApi';
import { setCredentials } from '../auth/authSlice';
import { showErrorToast, showSuccessToast } from '@/app/utils/toast';

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                    showSuccessToast('Registration successful');
                } catch (error) {
                    showErrorToast(error.message || 'Registration failed');
                }
            },
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                    showSuccessToast('Login successful');
                } catch (error) {
                    showErrorToast(error.message || 'Login failed');
                }
            },
        }),
        getMe: builder.query({
            query: () => '/users/me',
            providesTags: ['User'],
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeQuery } = authApi;
