import { useState } from "react";
import type { Utenti } from "../model/Classes";

type Props = {
    user?: Utenti;
};
export default function Registrazione({ user }: Props) {

    const [nomeForm, setNomeForm] = useState("");
    const [cognomeForm, setCognomeForm] = useState("");
    const [emailForm, setEmailForm] = useState("");
    const [pswForm, setPswForm] = useState("");
    const [confermaPsw, setConfermaPsw] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [currentUser, setCurrentUser] = useState<Utenti | null>(user || null);


    const userRegister = async (): Promise<Utenti | null> => {
    try {
        const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nomeForm,
                cognome: cognomeForm,
                email: emailForm,
                password: pswForm
            })
        });

        if (!response.ok) {
            console.warn('email già utilizzata o errore server:', response.status);
            return null;
        }

        const user: Utenti = await response.json();
        setCurrentUser(user);
        return user;
    } catch (err) {
        console.error('Errore nella fetch login:', err);
        return null;
    }
};



    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Funzione per validare l'email
    const isValidEmail = (email: string): boolean => {
        const emailCorrFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailCorrFormat.test(email);
    };

    if (emailForm.trim() !== "" && pswForm.trim() !== "") {
        // Validazione email
        if (!isValidEmail(emailForm.trim())) {
            alert("Inserisci un indirizzo email valido");
            return;
        }

        // Controllo password match prima della registrazione
        if (confermaPsw !== pswForm) { 
            alert("Le password non combaciano!");
            
            return;
        }

        const user = await userRegister();

        if (!user) {
            alert("Credenziali errate o utente non trovato");
        } else {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }

        // Reset dei campi
        setNomeForm("");
        setCognomeForm("");
        setEmailForm("");
        setConfermaPsw("");
        setPswForm("");
    } else {
        alert("Tutti i campi sono obbligatori");
    }
};



    return (
        <div className="max-w-md mx-auto p-4">
            {showAlert && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
                    <span className="text-green-800">Registrazione avvenuta con successo</span>
                </div>
            )}
            
            <div className="bg-white border rounded p-6">
                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2  text-black"
                        value={nomeForm}
                        onChange={(e) => setNomeForm(e.target.value)}
                        placeholder="nome..."
                    />
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2  text-black"
                        value={cognomeForm}
                        onChange={(e) => setCognomeForm(e.target.value)}
                        placeholder="cognome..."
                    />
                    <input
                        type="email"
                        className="w-full border rounded px-3 py-2  text-black"
                        value={emailForm}
                        onChange={(e) => setEmailForm(e.target.value)}
                        placeholder="Email..."
                    />
                    
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 text-black"
                        value={pswForm}
                        onChange={(e) => setPswForm(e.target.value)}
                        placeholder="Password..."
                        
                    />

                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 text-black"
                        value={confermaPsw}
                        onChange={(e) => setConfermaPsw(e.target.value)}
                        placeholder="conferma password..."
                        
                    />
                    
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Registrati
                    </button>
                </div>
            </div>
        </div>
    );

}