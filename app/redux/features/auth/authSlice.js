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
