import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const loadInitialState = () => {
    if (typeof window !== 'undefined') {
        const token = Cookies.get('accessToken');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            return {
                user: JSON.parse(userStr),
                token,
            };
        }
    }
    return {
        user: null,
        token: null,
    };
};

const initialState = loadInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            // Save to persistent storage
            Cookies.set('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            // Clear persistent storage
            Cookies.remove('accessToken');
            localStorage.removeItem('user');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
