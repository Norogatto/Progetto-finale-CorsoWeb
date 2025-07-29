//gestisce tutte le variabili che si andranno a salvare per essere mandate

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from "./todoSlice";
// import userReducer from "./userSlice";

// Crea lo store Redux
// Lo store è l'oggetto che contiene lo stato dell'applicazione
// e permette di gestire le azioni e i reducer
export const store = configureStore({
    reducer: {
        todos: todoReducer,
        // user: userReducer
    }
});

// Tipi per TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
