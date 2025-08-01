import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./TasksSlice";
import userReducer from "./userSlice"; // ✅ Decommentato

// Crea lo store Redux
// Lo store è l'oggetto che contiene lo stato dell'applicazione
// e permette di gestire le azioni e i reducer
export const store = configureStore({
  reducer: {
    todos: todoReducer,
    user: userReducer, // ✅ Aggiunto il userReducer
  },
});

// Tipi per TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
