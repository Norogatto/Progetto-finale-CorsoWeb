import { useState } from "react";
import type { Utenti } from "../model/Classes";

type Props = {
    user?: Utenti;
};
export default function LoginNew({ user }: Props) {

    const [emailForm, setEmailForm] = useState("");
    const [pswForm, setPswForm] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [currentUser, setCurrentUser] = useState<Utenti | null>(user || null);

    const loadAdmin = async (): Promise<Utenti | null> => {
        try {
            const response = await fetch('http://localhost:8080/api/admin');

            if (!response.ok) throw new Error(`Errore server: ${response.status}`);

            const adminArray: Utenti[] = await response.json();
            // Il server restituisce un array, prendiamo il primo elemento
            if (adminArray && adminArray.length > 0) {
                const adminUser = adminArray[0];
                setCurrentUser(adminUser);
                return adminUser;
            } else {
                console.log('Nessun admin trovato');
                return null;
            }

        } catch (err) {
            console.error('Errore nella fetch:', err);
            return null;
        }
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (emailForm.trim() !== "" && pswForm.trim() !== "") {
            setEmailForm("");
            setPswForm("");
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }
    }

    return (
        <div className="max-w-md mx-auto p-4">
            {showAlert && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
                    <span className="text-green-800">Login avvenuto con successo</span>
                </div>
            )}
            
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
                <div className="space-y-4">
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
                    
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                    
                    <button 
                        onClick={loadAdmin}
                        className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Carica Admin
                    </button>
                </div>
            </div>
        </div>
    );

}