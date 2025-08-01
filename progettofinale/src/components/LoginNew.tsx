import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import type { Utenti } from "../model/Classes";

type Props = {
    user?: Utenti;
};

export default function LoginNew({ user }: Props) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    // Usa Redux invece dello stato locale
    const { currentUser, loading, isAuthenticated } = useAppSelector((state) => state.user);
    
    const [emailForm, setEmailForm] = useState("");
    const [pswForm, setPswForm] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const loadUser = async (): Promise<Utenti | null> => {
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailForm,
                    password: pswForm
                })
            });

            if (!response.ok) {
                console.warn('Credenziali non valide o errore server:', response.status);
                return null;
            }

            const user: Utenti = await response.json();
            return user;
        } catch (err) {
            console.error('Errore nella fetch login:', err);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (emailForm.trim() !== "" && pswForm.trim() !== "") {
            dispatch(loginStart());
            
            const user = await loadUser();

            if (user) {
                dispatch(loginSuccess(user));
                setShowAlert(true);
                
                setTimeout(() => {
                    setShowAlert(false);
                    navigate('/TaskManager');
                }, 1500);
                
            } else {
                dispatch(loginFailure());
                alert("Credenziali errate o utente non trovato");
            }

            setEmailForm("");
            setPswForm("");
        } else {
            alert("Inserisci email e password");
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
                        Login avvenuto con successo! Reindirizzamento...
                    </span>
                </div>
            )}
            
            {currentUser && (
                <div className="mb-6 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                    <div className="text-indigo-300">
                        <p className="mb-1"><span className="font-medium">Utente:</span> {currentUser.nome} {currentUser.cognome}</p>
                        <p className="mb-1"><span className="font-medium">Email:</span> {currentUser.email}</p>
                        <p><span className="font-medium">Ruolo:</span> {currentUser.role ? 'Admin' : 'Utente'}</p>
                    </div>
                </div>
            )}
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Accedi</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                    
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 rounded-lg transition-all duration-200 font-medium"
                        disabled={loading}
                    >
                        {loading ? 'Accesso in corso...' : 'Accedi'}
                    </button>
                    
                    <div className="text-center mt-4">
                        <p className="text-indigo-200">
                            Non hai un account? <Link to="/Register" className="text-indigo-400 hover:text-indigo-300">Registrati</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}