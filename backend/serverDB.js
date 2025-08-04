const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const port = 8080;

// Middleware essenziali
app.use(cors());
app.use(express.json());

// Log per vedere le richieste
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});


// POST login
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

// POST register
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
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email già esistente' });
        }
        res.status(500).json({ error: 'Errore nel server durante la registrazione' });
    }
});


// GET - Recupera tutti i task di un utente
app.get('/api/tasks/user/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: 'ID utente richiesto' });
    }

    try {
        const [tasks] = await db.query(`
            SELECT t.*, s.nome_stato 
            FROM task t 
            LEFT JOIN state s ON t.stateID = s.idState 
            WHERE t.userID = ? 
            ORDER BY t.data_fine ASC, t.data_aggiunta DESC
        `, [userId]);

        console.log(`📋 Recuperati ${tasks.length} task per utente ${userId}`);
        res.json(tasks);
    } catch (error) {
        console.error('Errore nel recupero task:', error);
        res.status(500).json({ error: 'Errore nel recupero dei task' });
    }
});

// GET - Recupera i task
app.get('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const [tasks] = await db.query(`
            SELECT t.*, s.nome_stato 
            FROM task t 
            LEFT JOIN state s ON t.stateID = s.idState 
            WHERE t.idTask = ?
        `, [taskId]);

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'Task non trovato' });
        }

        res.json(tasks[0]);
    } catch (error) {
        console.error('Errore nel recupero task:', error);
        res.status(500).json({ error: 'Errore nel recupero del task' });
    }
});

// POST - Crea un nuovo task
app.post('/api/tasks', async (req, res) => {
    const { userID, stateID = 0, nome_task, descrizione, data_fine } = req.body;

    if (!userID || !nome_task || !data_fine) {
        return res.status(400).json({ 
            error: 'userID, nome_task e data_fine sono obbligatori' 
        });
    }

    try {
        // Verifica che l'utente esista
        const [users] = await db.query('SELECT idUtente FROM utenti WHERE idUtente = ?', [userID]);
        if (users.length === 0) {
            return res.status(400).json({ error: 'Utente non trovato' });
        }

        // Verifica che lo stato esista
        const [states] = await db.query('SELECT idState FROM state WHERE idState = ?', [stateID]);
        if (states.length === 0) {
            return res.status(400).json({ error: 'Stato non valido' });
        }

        // Inserisce il nuovo task
        const [result] = await db.query(`
            INSERT INTO task (userID, stateID, nome_task, descrizione, data_fine) 
            VALUES (?, ?, ?, ?, ?)
        `, [userID, stateID, nome_task, descrizione || '', data_fine]);

        // Recupera il task appena creato con tutte le informazioni
        const [newTask] = await db.query(`
            SELECT t.*, s.nome_stato 
            FROM task t 
            LEFT JOIN state s ON t.stateID = s.idState 
            WHERE t.idTask = ?
        `, [result.insertId]);

        res.status(201).json(newTask[0]);
    } catch (error) {
        console.error('Errore nella creazione task:', error);
        res.status(500).json({ error: 'Errore nella creazione del task' });
    }
});

//MODIFICA UN TASK
app.put('/api/tasks/:taskId', async (req, res) => {
   const { taskId } = req.params;
   const { nome_task, descrizione, data_fine } = req.body;

   try {
       // Aggiorna solo i campi forniti
       const result = await db.query(`
           UPDATE task 
           SET nome_task = COALESCE(?, nome_task),
               descrizione = COALESCE(?, descrizione),
               data_fine = COALESCE(?, data_fine)
           WHERE idTask = ?
       `, [nome_task, descrizione, data_fine, taskId]);

       // Controlla se il task esisteva
       if (result[0].affectedRows === 0) {
           return res.status(404).json({ error: 'Task non trovato' });
       }

       // Recupera il task aggiornato
       const [updatedTask] = await db.query(`
           SELECT t.*, s.nome_stato 
           FROM task t 
           LEFT JOIN state s ON t.stateID = s.idState 
           WHERE t.idTask = ?
       `, [taskId]);

       res.json(updatedTask[0]);
   } catch (error) {
       console.error('Errore nella modifica task:', error);
       res.status(500).json({ error: 'Errore nella modifica del task' });
   }
});

// PUT - Modifica solo lo stato di un task
app.put('/api/tasks/:taskId/state', async (req, res) => {
    const { taskId } = req.params;
    const { stateID } = req.body;

    if (stateID === undefined || stateID === null) {
        return res.status(400).json({ error: 'stateID è richiesto' });
    }

    try {
        // Verifica che il task esista
        const [existingTask] = await db.query('SELECT * FROM task WHERE idTask = ?', [taskId]);
        if (existingTask.length === 0) {
            return res.status(404).json({ error: 'Task non trovato' });
        }

        // Verifica che lo stato esista
        const [states] = await db.query('SELECT idState FROM state WHERE idState = ?', [stateID]);
        if (states.length === 0) {
            return res.status(400).json({ error: 'Stato non valido' });
        }

        // Aggiorna lo stato
        await db.query('UPDATE task SET stateID = ? WHERE idTask = ?', [stateID, taskId]);

        // Recupera il task aggiornato
        const [updatedTask] = await db.query(`
            SELECT t.*, s.nome_stato 
            FROM task t 
            LEFT JOIN state s ON t.stateID = s.idState 
            WHERE t.idTask = ?
        `, [taskId]);

        console.log(`🔄 Stato task ${taskId} cambiato a ${stateID}`);
        res.json(updatedTask[0]);
    } catch (error) {
        console.error('Errore nel cambio stato task:', error);
        res.status(500).json({ error: 'Errore nel cambio di stato del task' });
    }
});

// DELETE - Elimina un task
app.delete('/api/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        // Verifica che il task esista
        const [existingTask] = await db.query('SELECT * FROM task WHERE idTask = ?', [taskId]);
        if (existingTask.length === 0) {
            return res.status(404).json({ error: 'Task non trovato' });
        }

        // Elimina il task
        await db.query('DELETE FROM task WHERE idTask = ?', [taskId]);

        console.log(`🗑️ Task ${taskId} eliminato`);
        res.json({ message: 'Task eliminato con successo', idTask: parseInt(taskId) });
    } catch (error) {
        console.error('Errore nell\'eliminazione task:', error);
        res.status(500).json({ error: 'Errore nell\'eliminazione del task' });
    }
});

// GET - Recupera tutti gli stati disponibili
app.get('/api/states', async (req, res) => {
    try {
        const [states] = await db.query('SELECT * FROM state ORDER BY idState');
        res.json(states);
    } catch (error) {
        console.error('Errore nel recupero stati:', error);
        res.status(500).json({ error: 'Errore nel recupero degli stati' });
    }
});

// Gestione errori
app.use((err, req, res, next) => {
    console.error('💥 Errore server:', err);
    res.status(500).json({ error: 'Errore interno del server' });
});

// Route non trovata
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint non trovato' });
});

// Avvia server
app.listen(port, () => {
    console.log('\n🚀🚀🚀 SERVER TASK MANAGER AVVIATO 🚀🚀🚀');
    console.log(`📍 URL: http://localhost:${port}`);
    console.log('========================================\n');
});

// Gestione chiusura graceful
process.on('uncaughtException', (err) => {
    console.error('💥 Errore non gestito:', err);
});

process.on('SIGINT', () => {
    console.log('\n👋 Server fermato');
    process.exit(0);
});

module.exports = app;