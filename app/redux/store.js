import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './features/api/baseApi';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(baseApi.middleware),
});
