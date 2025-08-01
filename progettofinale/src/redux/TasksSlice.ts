import { type Task } from '../model/Classes';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Tipo per i dati del nuovo task
type NewTaskData = {
    nome_task: string;
    descrizione: string;
    stateID: number;
    userID: number;
    data_fine?: Date; // opzionale, se non fornita usa data corrente
};

// Stato iniziale del nostro slice
const initialState: Task[] = [];

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        // ✅ Un solo PayloadAction con un oggetto contenente tutti i dati
        aggiungiTodo: (state, action: PayloadAction<NewTaskData>) => {
            const newTask: Task = {
                idTask: Date.now(), // o usa una funzione per generare ID unici
                userID: action.payload.userID,
                stateID: action.payload.stateID,
                nome_task: action.payload.nome_task,
                descrizione: action.payload.descrizione,
                data_aggiunta: new Date(),
                data_fine: action.payload.data_fine || new Date()
            };
            state.push(newTask);
        },
        
        // ✅ Filtro per utente specifico
        rimuoviTodo: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.idTask !== action.payload);
        },

        // ✅ Rimuovi tutti i task di un utente
        rimuoviTuttiTaskUtente: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.userID !== action.payload);
        },
        
        // ✅ Ordina task per nome
        ordinaTodo: (state) => {
            state.sort((a, b) => a.nome_task.localeCompare(b.nome_task));
        },
        
        ordinaTodoDecrescente: (state) => {
            state.sort((a, b) => b.nome_task.localeCompare(a.nome_task));
        },

        // ✅ Ordina per data di aggiunta
        ordinaPerDataAggiunta: (state) => {
            state.sort((a, b) => new Date(a.data_aggiunta).getTime() - new Date(b.data_aggiunta).getTime());
        },

        // ✅ Ordina per data di scadenza
        ordinaPerDataScadenza: (state) => {
            state.sort((a, b) => new Date(a.data_fine).getTime() - new Date(b.data_fine).getTime());
        },
        
        // ✅ Cambia stato del task (0=da fare, 1=in corso, 2=completato, ecc.)
        cambiaStatoTask: (state, action: PayloadAction<{ idTask: number; stateID: number }>) => {
            const task = state.find(t => t.idTask === action.payload.idTask);
            if (task) {
                task.stateID = action.payload.stateID;
            }
        },
        
        // ✅ Modifica data di fine
        setDataFine: (state, action: PayloadAction<{ idTask: number; data_fine: Date }>) => {
            const task = state.find((task) => task.idTask === action.payload.idTask);
            if (task) {
                task.data_fine = action.payload.data_fine;
            }
        },
        
        // ✅ Modifica task esistente
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

        // ✅ Ottieni task per utente (helper per filtering)
        filtraTaskPerUtente: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.userID === action.payload);
        },

        // ✅ Ottieni task per stato
        filtraTaskPerStato: (state, action: PayloadAction<number>) => {
            return state.filter(task => task.stateID === action.payload);
        },

        // ✅ Carica task dal server
        caricaTasks: (state, action: PayloadAction<Task[]>) => {
            return action.payload;
        },

        // ✅ Pulisci tutti i task
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