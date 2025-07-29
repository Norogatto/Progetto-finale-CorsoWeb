import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Tipo Todo con tutte le proprietà necessarie
export type Todo = {
    id: number;
    testo: string;
    completato: boolean;
    dataAggiunta: string;
    dataCompletamento?: string;
    dataScadenza: string;
};

// Stato iniziale del nostro slice
const initialState: Todo[] = [];

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        aggiungiTodo: (state, action: PayloadAction<string>) => {
            state.push({
                id: Date.now(),
                testo: action.payload,
                completato: false,
                dataAggiunta: new Date().toISOString().split('T')[0],
                dataScadenza: new Date().toISOString().split('T')[0]
            });
        },
        rimuoviTodo: (state, action: PayloadAction<number>) => {
            return state.filter(todo => todo.id !== action.payload);
        },
        ordinaTodo: (state) => {
            state.sort((a, b) => a.testo.localeCompare(b.testo));
        },
        ordinaTodoDecrescente: (state) => {
            state.sort((a, b) => b.testo.localeCompare(a.testo));
        },
        toggleCompletato: (state, action: PayloadAction<{ id: number; completato: boolean }>) => {
            const todo = state.find(t => t.id === action.payload.id);
            if (todo) {
                todo.completato = action.payload.completato;
            }
        },
        setDataCompletamento: (state, action: PayloadAction<{ id: number; dataCompletamento?: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.dataCompletamento = action.payload.dataCompletamento;
            }
        },
        setDataScadenza: (state, action: PayloadAction<{ id: number; dataScadenza: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.dataScadenza = action.payload.dataScadenza;
            }
        }
    }
});

export const {
    aggiungiTodo,
    rimuoviTodo,
    toggleCompletato,
    ordinaTodo,
    ordinaTodoDecrescente,
    setDataCompletamento,
    setDataScadenza
} = todoSlice.actions;

export default todoSlice.reducer;