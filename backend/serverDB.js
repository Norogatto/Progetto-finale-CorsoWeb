
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 8080;

// Middleware essenziali
app.use(cors());
app.use(express.json());

///////////////////////////////////////////////////////////////////////////

/*
// GET USER 'admin'
app.get('/api/admin', async (req, res) => {
    try {
        console.log('Tentativo di recupero admin...');
        const [admin] = await db.query('SELECT * FROM utenti WHERE email=?', ['admin@gmail.com']);
        console.log('ADMIN:', admin);
        res.json(admin);
    } catch (error) {
        console.error('Errore GET admin - Dettagli completi:', error);
        console.error('Errore message:', error.message);
        console.error('Errore code:', error.code);
        res.status(500).json({ error: 'Errore nel recupero admin' });
    }
}); */
const bcrypt = require('bcryptjs');
//POST login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e password sono obbligatori' });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM utenti WHERE email = ?',
            [email]
        );

        if (!rows || rows.length !== 1) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        const user = rows[0];
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenziali non valide' });
        }

        delete user.password;

        return res.json(user);
    } catch (error) {
        console.error('Errore nel login:', error);
        return res.status(500).json({ error: 'Errore del server durante il login' });
    }
});

app.post('/api/register', async (req, res) => {
    const { email, password, nome, cognome } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e password obbligatori' });
    }

    try {
        // Crea l'hash della password
        const passwordHash = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO utenti (email, password, nome, cognome) VALUES (?, ?, ?, ?)',
            [email, passwordHash, nome, cognome]
        );

        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (error) {
        console.error('Errore nella registrazione:', error);
        res.status(500).json({ error: 'Errore nel server durante la registrazione' });
    }
});






////////////////////////////////////////////////////////////////////////////

// Avvia server
app.listen(port, () => {
    console.log('\n🚀🚀🚀 SERVER TEST AVVIATO 🚀🚀🚀');
    console.log(`📍 URL: http://localhost:${port}`);
    console.log('========================================\n');
});

// Log per vedere le richieste
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Gestione errori
app.use((err, req, res, next) => {
    console.error('💥 Errore server:', err);
    res.status(500).json({ error: 'Errore interno del server' });
});

process.on('uncaughtException', (err) => {
    console.error('💥 Errore non gestito:', err);
});

process.on('SIGINT', () => {
    console.log('\n👋 Server fermato');
    process.exit(0);
});


