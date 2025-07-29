export type Utenti = {
    idUtente: Number;
    nome: string;
    cognome: string;
    email: string;
    password: string;
    role: boolean;
}
export type State={
    idState: number;
    nome_stato: string;
}

export type Task={
    idTask: number;
    userID: number;
    stateID: number;
    nome_task: string;
    descrizione: string;
    data_aggiunta: Date;
    data_fine: Date;
}