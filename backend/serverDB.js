/*const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const port = 8080;

app.use(cors({
    origin: 'http://localhost:5173', // Permetti richieste dal frontend Vue
}));
app.use(express.json()); // Usa il parser JSON integrato di Express



// GET lista tasks
app.get('/api/task', async (req, res) => {
    try {
        console.log('Tentativo di recupero tasks...');
        const [rows] = await db.query('SELECT * FROM task');
        console.log('Tasks recuperate:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Errore GET tasks - Dettagli completi:', error);
        console.error('Errore message:', error.message);
        console.error('Errore code:', error.code);
        res.status(500).json({ error: 'Errore nel recupero tasks' });
    }
});

// POST aggiungi task
app.post('/api/task', async (req, res) => {
    const { nome_task, descrizione, data_fine } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO tasks (nome_task, descrizione, data_fine) VALUES (?, ?, ?)',
            [nome_task, descrizione, data_fine]
        );
        const newTask = { id: result.insertId, nome_task, descrizione, data_fine };
        res.json(newTask);
    } catch (error) {
        console.error('Errore POST task', error);
        res.status(500).json({ error: 'Errore creazione task' });
    }
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});*/
// Aggiungi questo al tuo serverDB.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const port = 8080;

app.use(cors({
    origin: 'http://localhost:5173/', // Permetti richieste dal frontend Vue
}));
app.use(express.json()); // Usa il parser JSON integrato di Express
// POST login utente
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        console.log('Tentativo di login per:', email);
        
        // Query per trovare l'utente con email e password
        const [rows] = await db.query(
            'SELECT * FROM utenti WHERE email = ? AND password = ?',
            [email, password]
        );
        
        if (rows.length > 0) {
            const user = rows[0];
            // Rimuovi la password dalla risposta per sicurezza
            const { password: _, ...userWithoutPassword } = user;
            
            console.log('Login riuscito per:', email);
            res.json({ 
                success: true, 
                message: 'Login riuscito',
                user: userWithoutPassword 
            });
        } else {
            console.log('Login fallito per:', email);
            res.status(401).json({ 
                success: false, 
                message: 'Email o password non corretti' 
            });
        }
    } catch (error) {
        console.error('Errore LOGIN:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Errore nel server durante il login' 
        });
    }
});

// GET tutti gli utenti (opzionale, per debug)
app.get('/api/utenti', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT idUtente, nome, cognome, email, role FROM utenti');
        res.json(rows);
    } catch (error) {
        console.error('Errore GET utenti:', error);
        res.status(500).json({ error: 'Errore nel recupero utenti' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});