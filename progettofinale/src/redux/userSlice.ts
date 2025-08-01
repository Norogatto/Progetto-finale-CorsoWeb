import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Utenti } from '../model/Classes';

interface UserState {
    currentUser: Utenti | null;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: UserState = {
    currentUser: null,
    isAuthenticated: false,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, action: PayloadAction<Utenti>) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFailure: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.loading = false;
        },
        clearUser: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.loading = false;
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearUser } = userSlice.actions;
export default userSlice.reducer;