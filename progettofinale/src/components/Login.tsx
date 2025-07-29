import { useState } from "react";
import { type Utenti } from "../model/Classes";

type LoginResponse = {
    success: boolean;
    message: string;
    user?: Omit<Utenti, 'password'>;
    error?: string;
};

type Props = { 
    onLoginSuccess: (user: Omit<Utenti, 'password'>) => void;
};

export default function Login({ onLoginSuccess }: Props) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data: LoginResponse = await response.json();

            if (data.success && data.user) {
                console.log('Login riuscito:', data.user);
                onLoginSuccess(data.user);
            } else {
                setError(data.message || 'Errore durante il login');
            }
        } catch (error) {
            console.error('Errore di rete:', error);
            setError('Errore di connessione al server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Login</h2>
                
                {error && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="login-button"
                >
                    {loading ? 'Accesso in corso...' : 'Accedi'}
                </button>
            </form>
        </div>
    );
}