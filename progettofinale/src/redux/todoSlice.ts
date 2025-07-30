import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Task = {
    idTask: number;
    userID: number;
    stateID: number;
    nome_task: string;
    descrizione: string | null;
    data_aggiunta: string;
    data_fine: string;
};

export type State = {
    idState: number;
    nome_stato: string;
};

export type User = {
    idUtente: number;
    nome: string;
    cognome: string;
    email: string;
    password: string;
    role: boolean;
};

type TodoState = {
    tasks: Task[];
    states: State[];
    users: User[];
    currentUser: number | null;
    loading: boolean;
    error: string | null;
};

const initialState: TodoState = {
    tasks: [],
    states: [
        { idState: 1, nome_stato: 'Da fare' },
        { idState: 2, nome_stato: 'In corso' },
        { idState: 3, nome_stato: 'Completato' },
    ],
    users: [],
    currentUser: null,
    loading: false,
    error: null,
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Omit<Task, 'idTask' | 'data_aggiunta'>>) => {
            const newTask: Task = {
                ...action.payload,
                idTask: Date.now(),
                data_aggiunta: new Date().toISOString(),
            };
            state.tasks.push(newTask);
        },
        removeTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter(task => task.idTask !== action.payload);
        },
        updateTask: (state, action: PayloadAction<{ idTask: number; updates: Partial<Task> }>) => {
            const index = state.tasks.findIndex(task => task.idTask === action.payload.idTask);
            if (index !== -1) {
                state.tasks[index] = {
                    ...state.tasks[index],
                    ...action.payload.updates,
                };
            }
        },
        changeTaskState: (state, action: PayloadAction<{ idTask: number; stateID: number }>) => {
            const task = state.tasks.find(t => t.idTask === action.payload.idTask);
            if (task) {
                task.stateID = action.payload.stateID;
            }
        },
        setDataFine: (state, action: PayloadAction<{ idTask: number; data_fine: string }>) => {
            const task = state.tasks.find(t => t.idTask === action.payload.idTask);
            if (task) {
                task.data_fine = action.payload.data_fine;
            }
        },
        setCurrentUser: (state, action: PayloadAction<number | null>) => {
            state.currentUser = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        ordinaTodo: (state) => {
            state.tasks.sort((a, b) => a.nome_task.localeCompare(b.nome_task));
        },
        ordinaTodoDecrescente: (state) => {
            state.tasks.sort((a, b) => b.nome_task.localeCompare(a.nome_task));
        },
    },
});

export const {
    addTask,
    removeTask,
    updateTask,
    changeTaskState,
    setCurrentUser,
    setLoading,
    setError,
    setTasks,
    setUsers,
    ordinaTodo,
    ordinaTodoDecrescente,
    setDataFine,
} = todoSlice.actions;

export default todoSlice.reducer;