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
// Crea un file test-server.js con questo codice minimo
const express = require('express');
const cors = require('cors');
const db = require('./db'); 

const app = express();
const port = 8080;

// Middleware essenziali
app.use(cors());
app.use(express.json());


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
});

// Avvia server
app.listen(port, () => {
    console.log('\n🚀🚀🚀 SERVER TEST AVVIATO 🚀🚀🚀');
    console.log(`📍 URL: http://localhost:${port}`);
    console.log('========================================\n');
});




///////////////////////////////////////////////////////////////////////////////////////////////////////////


// Log per vedere le richieste
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Endpoint di test semplicissimo
app.get('/api/test', (req, res) => {
    console.log('✅ Richiesta di test ricevuta!');
    res.json({ 
        message: 'Server funziona!', 
        timestamp: new Date().toISOString(),
        port: port
    });
});

// Endpoint login semplificato
app.post('/api/login', (req, res) => {
    console.log('✅ Richiesta login ricevuta!');
    console.log('Body:', req.body);
    
    const { email, password } = req.body;
    
    // Test senza database
    if (email === 'test@test.com' && password === 'test') {
        res.json({
            success: true,
            message: 'Login di test riuscito',
            user: { id: 1, nome: 'Test', email: 'test@test.com' }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Usa email: test@test.com e password: test'
        });
    }
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