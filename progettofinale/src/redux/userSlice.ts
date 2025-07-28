import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Stato iniziale: una stringa vuota per il nome
const initialState = '';


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (_state, action: PayloadAction<string>) => action.payload,
        clearName: () => ''
    }
});

export const { setName, clearName } = userSlice.actions;
export default userSlice.reducer;