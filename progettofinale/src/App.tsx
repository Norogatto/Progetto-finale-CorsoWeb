import { useState } from 'react';
import Login from './components/Login';
import { type Utenti } from './model/Classes';

type UserWithoutPassword = Omit<Utenti, 'password'>;

function App() {
    const [currentUser, setCurrentUser] = useState<UserWithoutPassword | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const handleLoginSuccess = (user: UserWithoutPassword) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
        console.log('Utente loggato:', user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="App">
                <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return (
        <div className="App">
            <header>
                <h1>Benvenuto, {currentUser?.nome} {currentUser?.cognome}!</h1>
                <p>Email: {currentUser?.email}</p>
                <p>Ruolo: {currentUser?.role ? 'Admin' : 'Utente'}</p>
                <button onClick={handleLogout}>Logout</button>
            </header>
            
            <main>
                {/* Qui puoi aggiungere il resto della tua applicazione */}
                <h2>Dashboard</h2>
                <p>Qui vedrai le tue tasks...</p>
            </main>
        </div>
    );
}

export default App;