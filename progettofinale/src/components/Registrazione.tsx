import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { loginSuccess } from "../redux/userSlice";
import type { Utenti } from "../model/Classes";

type Props = {
    user?: Utenti;
};
export default function Registrazione({ user }: Props) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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

        // Controllo password prima della registrazione
        if (confermaPsw !== pswForm) { 
            alert("Le password non combaciano!");
            
            return;
        }

        const user = await userRegister();

        if (!user) {
            alert("Credenziali errate o utente non trovato");
        } else {
            dispatch(loginSuccess(user));
            setShowAlert(true);
            
            setTimeout(() => {
                setShowAlert(false);
                navigate('/TaskManager');
            }, 1500);
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
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <span className="text-green-400 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Registrazione avvenuta con successo! Reindirizzamento...
                    </span>
                </div>
            )}
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Registrati</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Nome</label>
                        <input
                            type="text"
                            className="w-full"
                            value={nomeForm}
                            onChange={(e) => setNomeForm(e.target.value)}
                            placeholder="Il tuo nome"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Cognome</label>
                        <input
                            type="text"
                            className="w-full"
                            value={cognomeForm}
                            onChange={(e) => setCognomeForm(e.target.value)}
                            placeholder="Il tuo cognome"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full"
                            value={emailForm}
                            onChange={(e) => setEmailForm(e.target.value)}
                            placeholder="La tua email"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full"
                            value={pswForm}
                            onChange={(e) => setPswForm(e.target.value)}
                            placeholder="La tua password"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Conferma Password</label>
                        <input
                            type="password"
                            className="w-full"
                            value={confermaPsw}
                            onChange={(e) => setConfermaPsw(e.target.value)}
                            placeholder="Conferma la tua password"
                        />
                    </div>
                    
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-lg transition-all duration-200 font-medium mt-2"
                    >
                        Registrati
                    </button>
                    
                    <div className="text-center mt-4">
                        <p className="text-indigo-200">
                            Hai già un account? <Link to="/Login" className="text-indigo-400 hover:text-indigo-300">Accedi</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

}