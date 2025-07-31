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
    // ❌ Rimosso: currentUser locale non serve più

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
            // ❌ Rimosso: setCurrentUser(user) - ora usa Redux
            return user;
        } catch (err) {
            console.error('Errore nella fetch login:', err);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (emailForm.trim() !== "" && pswForm.trim() !== "") {
            // ✅ Dispatch loading state
            dispatch(loginStart());
            
            const user = await loadUser();

            if (user) {
                // ✅ Salva utente nello store Redux
                dispatch(loginSuccess(user));
                setShowAlert(true);
                
                // ✅ Route corretta (senza .tsx)
                setTimeout(() => {
                    setShowAlert(false);
                    navigate('/TaskManager');
                }, 1500);
                
            } else {
                // ✅ Dispatch fallimento
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
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
                    <span className="text-green-800">Login avvenuto con successo! Reindirizzamento...</span>
                </div>
            )}
            
            {/* ✅ Ora usa currentUser da Redux */}
            {currentUser && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
                    <div className="text-blue-800">
                        <p>Utente: {currentUser.nome} {currentUser.cognome}</p>
                        <p>Email: {currentUser.email}</p>
                        <p>Ruolo: {currentUser.role ? 'Admin' : 'Utente'}</p>
                    </div>
                </div>
            )}
            
            <div className="bg-white border rounded p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        className="w-full border rounded px-3 py-2 text-black"
                        value={emailForm}
                        onChange={(e) => setEmailForm(e.target.value)}
                        placeholder="Email..."
                        required
                        disabled={loading} // ✅ Disabilita durante il loading
                    />
                    
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 text-black"
                        value={pswForm}
                        onChange={(e) => setPswForm(e.target.value)}
                        placeholder="Password..."
                        required
                        disabled={loading} // ✅ Disabilita durante il loading
                    />
                   
                    <Link to="/Register">
                        <p className="underline mb-1">Registrati ora!</p>
                    </Link>
                    
                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                        disabled={!emailForm.trim() || !pswForm.trim() || loading}
                    >
                        {loading ? 'Accesso in corso...' : 'Login'} {/* ✅ Testo dinamico */}
                    </button>
                </form>
            </div>
        </div>
    );
}