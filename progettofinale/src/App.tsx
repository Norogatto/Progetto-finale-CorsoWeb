import { useState } from 'react';
import { type Utenti } from './model/Classes';
import SimpleTest from './components/Login';
import LoginNew from './components/LoginNew';

type UserWithoutPassword = Omit<Utenti, 'password'>;

function App() {
    /*
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
                <SimpleTest onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }
        */

    return (
        /*
        <div className="App">
            
            <header>
                <h1>Benvenuto, {currentUser?.nome} {currentUser?.cognome}!</h1>
                <p>Email: {currentUser?.email}</p>
                <p>Ruolo: {currentUser?.role ? 'Admin' : 'Utente'}</p>
                <button onClick={handleLogout}>Logout</button>
            </header>
            
            <main>
                <h2>Dashboard</h2>
                <p>Qui vedrai le tue tasks...</p>
            </main>
        </div> 
        
        */
        <div className="App">
            <h1>Test Login</h1>
            <LoginNew />
        </div>
    );
}

export default App;