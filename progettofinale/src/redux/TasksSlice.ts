import { type Task } from '../model/Classes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type NewTaskData = {
    nome_task: string;
    descrizione: string;
    stateID: number;
    userID: number;
    data_fine?: Date; 
};

const initialState: Task[] = [];

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        aggiungiTodo: (state, action: PayloadAction<NewTaskData>) => {
            const newTask: Task = {
                idTask: Date.now(), 
                userID: action.payload.userID,
                stateID: action.payload.stateID,
                nome_task: action.payload.nome_task,
                descrizione: action.payload.descrizione,
                data_aggiunta: new Date(),
                data_fine: action.payload.data_fine || new Date()
            };
            state.push(newTask);
        },
        
        rimuoviTodo: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.idTask !== action.payload);
        },

        rimuoviTuttiTaskUtente: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.userID !== action.payload);
        },
        
        ordinaTodo: (state) => {
            state.sort((a, b) => a.nome_task.localeCompare(b.nome_task));
        },
        
        ordinaTodoDecrescente: (state) => {
            state.sort((a, b) => b.nome_task.localeCompare(a.nome_task));
        },

        ordinaPerDataAggiunta: (state) => {
            state.sort((a, b) => new Date(a.data_aggiunta).getTime() - new Date(b.data_aggiunta).getTime());
        },

        ordinaPerDataScadenza: (state) => {
            state.sort((a, b) => new Date(a.data_fine).getTime() - new Date(b.data_fine).getTime());
        },
        
        cambiaStatoTask: (state, action: PayloadAction<{ idTask: number; stateID: number }>) => {
            return state.map(task => 
                task.idTask === action.payload.idTask 
                    ? { ...task, stateID: action.payload.stateID }
                    : task
            );
        },
        
        setDataFine: (state, action: PayloadAction<{ idTask: number; data_fine: Date }>) => {
            const task = state.find((task) => task.idTask === action.payload.idTask);
            if (task) {
                task.data_fine = action.payload.data_fine;
            }
        },
        
        modificaTask: (state, action: PayloadAction<{ idTask: number; nome_task?: string; descrizione?: string; data_fine?: Date }>) => {
            const task = state.find(t => t.idTask === action.payload.idTask);
            if (task) {
                if (action.payload.nome_task) {
                    task.nome_task = action.payload.nome_task;
                }
                if (action.payload.descrizione) {
                    task.descrizione = action.payload.descrizione;
                }
                if (action.payload.data_fine) {
                    task.data_fine = action.payload.data_fine;
                }
            }
        },

        filtraTaskPerUtente: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.userID === action.payload);
        },

        filtraTaskPerStato: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.stateID === action.payload);
        },

        caricaTasks: (state, action: PayloadAction<Task[]>) => {
            return action.payload;
        },

        pulisciTasks: (state) => {
            return [];
        }
    }
});

export const {
    aggiungiTodo,
    rimuoviTodo,
    rimuoviTuttiTaskUtente,
    cambiaStatoTask,
    ordinaTodo,
    ordinaTodoDecrescente,
    ordinaPerDataAggiunta,
    ordinaPerDataScadenza,
    setDataFine,
    modificaTask,
    filtraTaskPerUtente,
    filtraTaskPerStato,
    caricaTasks,
    pulisciTasks
} = todoSlice.actions;

export default todoSlice.reducer;