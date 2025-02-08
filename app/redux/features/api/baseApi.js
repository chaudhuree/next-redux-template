import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://104.236.194.254:5009/api/v1',
        prepareHeaders: (headers) => {
            const token = Cookies.get("accessToken")
            if (token) {
                headers.set('Authorization', `${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: ["logIn", "transaction", "allUsers", "allProducts", "allOrders"] 
    // define all the tags what we will use to invalidate the cache after mutation
});

export default baseApi;
