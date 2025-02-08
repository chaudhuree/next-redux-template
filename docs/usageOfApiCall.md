# Redux Setup and API Integration Guide

This guide explains the step-by-step setup and usage of Redux and API integration in this Next.js project.

## Project Structure
```
app/
├── redux/
│   ├── features/
│   │   ├── api/
│   │   │   ├── baseApi.js    # Base API configuration
│   │   │   └── userApi.js    # User-related API endpoints
│   │   └── auth/
│   │       └── authSlice.js  # Authentication state management
│   ├── provider.js           # Redux Provider wrapper
│   └── store.js             # Redux store configuration
└── utils/
    └── toast.js             # Toast notification utilities
```

## 1. Base API Setup
First, set up the base API configuration using RTK Query:

```javascript
// app/redux/features/api/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://your-api-url/api/v1',
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
});

export default baseApi;
```

## 2. Feature API Implementation
Create specific API endpoints by extending the base API:

```javascript
// app/redux/features/api/userApi.js
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
    })
});

export const { 
    useLoginUserMutation, 
    useAllUsersQuery, 
    useUserStatusUpdateMutation 
} = userApi;
```

## 3. Redux Slice Setup
Create slices for managing state:

```javascript
// app/redux/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    name: "",
    role: "",
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.role = action.payload.role;
        },
        logOut: (state) => {
            state.name = "";
            state.role = "";
            Cookies.remove("accessToken");
        }
    },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
```

## 4. Redux Store Configuration
Configure the Redux store with all reducers and middleware:

```javascript
// app/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/auth/authSlice';
import baseApi from './features/api/baseApi';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['auth.somePathWithNonSerializableValues'],
            },
        }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
```

## 5. Redux Provider Setup
Wrap your application with Redux Provider:

```javascript
// app/redux/provider.js
'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};

export default ReduxProvider;
```

## 6. Toast Notification Setup
Set up toast notifications for user feedback:

```javascript
// app/utils/toast.js
import { toast } from 'sonner';

export const showSuccessToast = (message) => {
    toast.success(message);
};

export const showErrorToast = (message) => {
    toast.error(message);
};

export const showInfoToast = (message) => {
    toast.info(message);
};

export const showLoadingToast = (message) => {
    toast.loading(message);
};
```

## 7. Usage in Components

### Making API Calls
```javascript
'use client';
import { useAllUsersQuery, useUserStatusUpdateMutation } from '@/app/redux/features/api/userApi';
import { showSuccessToast, showErrorToast } from '@/app/utils/toast';

export default function UserList() {
    // Query hook
    const { data, isLoading } = useAllUsersQuery({
        page: 1,
        limit: 10,
        name: ''
    });

    // Mutation hook
    const [updateStatus, { isLoading: isUpdating }] = useUserStatusUpdateMutation();

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
            showSuccessToast('Status updated successfully');
        } catch (error) {
            showErrorToast(error.message || 'Failed to update status');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            {data?.users.map(user => (
                <div key={user.id}>
                    {user.name}
                    <button 
                        onClick={() => handleStatusUpdate(user.id, 'active')}
                        disabled={isUpdating}
                    >
                        Activate
                    </button>
                </div>
            ))}
        </div>
    );
}
```

### Managing Auth State
```javascript
'use client';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginUserMutation } from '@/app/redux/features/api/userApi';
import { setUser } from '@/app/redux/features/auth/authSlice';

export default function LoginPage() {
    const dispatch = useDispatch();
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({
                email: 'user@example.com',
                password: 'password'
            }).unwrap();
            
            dispatch(setUser({
                name: response.name,
                role: response.role
            }));
            
            showSuccessToast('Login successful');
        } catch (error) {
            showErrorToast(error.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {/* form fields */}
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}
```

## Best Practices

1. **API Calls**
   - Always use the `.unwrap()` method when handling API responses
   - Implement proper error handling with try-catch blocks
   - Use loading states for better UX

2. **State Management**
   - Use Redux for global state only
   - Keep component-specific state with useState
   - Utilize RTK Query's automatic caching

3. **Error Handling**
   - Always show user-friendly error messages
   - Handle specific error cases (401, 403, etc.)
   - Log errors for debugging

4. **Performance**
   - Use proper tag invalidation for cache management
   - Implement pagination where needed
   - Avoid unnecessary re-renders

This documentation follows the actual implementation order and file structure of the project. Each section builds upon the previous one, making it easier to understand and implement the features.