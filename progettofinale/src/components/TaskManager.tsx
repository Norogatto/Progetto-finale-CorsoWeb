import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/userSlice";
import { 
  aggiungiTodo, 
  rimuoviTodo, 
  cambiaStatoTask, 
  modificaTask, 
  caricaTasks 
} from "../redux/TasksSlice";
import type { Task } from "../model/Classes";

// Tipi per le operazioni CRUD
type NewTaskData = {
  nome_task: string;
  descrizione: string;
  data_fine: string; // formato YYYY-MM-DD per MySQL
};

type UpdateTaskData = {
  idTask: number;
  nome_task?: string;
  descrizione?: string;
  data_fine?: string;
};

function TaskManager() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);
  const tasks = useAppSelector((state) => state.todos);
  
  // Local state per form e loading
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskData>({
    nome_task: '',
    descrizione: '',
    data_fine: new Date().toISOString().split('T')[0]
  });
  const [editingTask, setEditingTask] = useState<UpdateTaskData | null>(null);

  // Reindirizza al login se non autenticato
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/Login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Carica task al mount
  useEffect(() => {
    if (currentUser) {
      loadTasksFromDB();
    }
  }, [currentUser]);

  // ===== OPERAZIONI DATABASE =====

  // Carica tutti i task dell'utente dal DB
  const loadTasksFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/tasks/user/${currentUser?.idUtente}`);
      
      if (!response.ok) throw new Error('Errore nel caricamento task');
      
      const tasksFromDB: Task[] = await response.json();
      
      // Converte le date string in oggetti Date
      const processedTasks = tasksFromDB.map(task => ({
        ...task,
        data_aggiunta: new Date(task.data_aggiunta),
        data_fine: new Date(task.data_fine)
      }));
      
      dispatch(caricaTasks(processedTasks));
    } catch (error) {
      console.error('Errore caricamento task:', error);
      alert('Errore nel caricamento dei task');
    } finally {
      setLoading(false);
    }
  };

  // Aggiungi nuovo task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTask.nome_task.trim()) return;

    try {
      setLoading(true);
      
      const taskToSend = {
        userID: currentUser.idUtente,
        stateID: 0, // 0 = da fare
        nome_task: newTask.nome_task,
        descrizione: newTask.descrizione,
        data_fine: newTask.data_fine
      };

      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToSend)
      });

      if (!response.ok) throw new Error('Errore nella creazione del task');
      
      const createdTask: Task = await response.json();
      
      // Aggiorna Redux con il task dal server
      dispatch(aggiungiTodo({
        nome_task: createdTask.nome_task,
        descrizione: createdTask.descrizione,
        stateID: createdTask.stateID,
        userID: createdTask.userID,
        data_fine: new Date(createdTask.data_fine)
      }));

      // Reset form
      setNewTask({
        nome_task: '',
        descrizione: '',
        data_fine: new Date().toISOString().split('T')[0]
      });

    } catch (error) {
      console.error('Errore aggiunta task:', error);
      alert('Errore nell\'aggiunta del task');
    } finally {
      setLoading(false);
    }
  };

  // Elimina task
  const handleDeleteTask = async (idTask: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/tasks/${idTask}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Errore nell\'eliminazione del task');
      
      dispatch(rimuoviTodo(idTask));

    } catch (error) {
      console.error('Errore eliminazione task:', error);
      alert('Errore nell\'eliminazione del task');
    } finally {
      setLoading(false);
    }
  };

  // Cambia stato task
  const handleChangeTaskState = async (idTask: number, newStateID: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/tasks/${idTask}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateID: newStateID })
      });

      if (!response.ok) throw new Error('Errore nel cambio stato');
      
      dispatch(cambiaStatoTask({ idTask, stateID: newStateID }));

    } catch (error) {
      console.error('Errore cambio stato:', error);
      alert('Errore nel cambio di stato');
    } finally {
      setLoading(false);
    }
  };

  // Modifica task
  const handleUpdateTask = async (updateData: UpdateTaskData) => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/tasks/${updateData.idTask}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_task: updateData.nome_task,
          descrizione: updateData.descrizione,
          data_fine: updateData.data_fine
        })
      });

      if (!response.ok) throw new Error('Errore nella modifica del task');
      
      dispatch(modificaTask({
        idTask: updateData.idTask,
        nome_task: updateData.nome_task,
        descrizione: updateData.descrizione,
        data_fine: updateData.data_fine ? new Date(updateData.data_fine) : undefined
      }));

      setEditingTask(null);

    } catch (error) {
      console.error('Errore modifica task:', error);
      alert('Errore nella modifica del task');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/Login');
  };

  // Helper per ottenere il nome dello stato
  const getStateName = (stateID: number) => {
    switch (stateID) {
      case 0: return { name: 'Da fare', color: 'bg-red-500', emoji: '📋' };
      case 1: return { name: 'In corso', color: 'bg-yellow-500', emoji: '⏳' };
      case 2: return { name: 'Completato', color: 'bg-green-500', emoji: '✅' };
      default: return { name: 'Sconosciuto', color: 'bg-gray-500', emoji: '❓' };
    }
  };

  // Filtra task per stato
  const tasksDaFare = tasks.filter(task => task.userID === currentUser?.idUtente && task.stateID === 0);
  const tasksInCorso = tasks.filter(task => task.userID === currentUser?.idUtente && task.stateID === 1);
  const tasksCompletati = tasks.filter(task => task.userID === currentUser?.idUtente && task.stateID === 2);

  // Se non c'è utente, non renderizzare nulla (redirect in corso)
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Header con informazioni utente e logout */}
      <div className="container mx-auto max-w-6xl relative z-10 mb-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-white">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-white/80 mt-1">
                Benvenuto, {currentUser.nome} {currentUser.cognome}!
              </p>
              <p className="text-white/60 text-sm">
                {currentUser.email} | {currentUser.role ? '👑 Admin' : '👤 Utente'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={loadTasksFromDB}
                disabled={loading}
                className="bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-xl backdrop-blur-sm border border-blue-400/30 transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                🔄 Ricarica
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-xl backdrop-blur-sm border border-red-400/30 transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Effetti di background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* Contenuto principale */}
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Form aggiunta task */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">➕ Nuovo Task</h2>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Nome task..."
              value={newTask.nome_task}
              onChange={(e) => setNewTask(prev => ({ ...prev, nome_task: e.target.value }))}
              className="px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
              required
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Descrizione..."
              value={newTask.descrizione}
              onChange={(e) => setNewTask(prev => ({ ...prev, descrizione: e.target.value }))}
              className="px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
              disabled={loading}
            />
            <input
              type="date"
              value={newTask.data_fine}
              onChange={(e) => setNewTask(prev => ({ ...prev, data_fine: e.target.value }))}
              className="px-4 py-2 rounded-xl bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newTask.nome_task.trim()}
              className="px-6 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-xl border border-green-400/30 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              {loading ? '⏳' : '➕ Aggiungi'}
            </button>
          </form>
        </div>

        {/* Dashboard task per stato */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Da fare */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📋 Da fare <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">{tasksDaFare.length}</span>
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasksDaFare.map(task => (
                <TaskCard 
                  key={task.idTask} 
                  task={task} 
                  onDelete={handleDeleteTask}
                  onChangeState={handleChangeTaskState}
                  onEdit={setEditingTask}
                  getStateName={getStateName}
                  loading={loading}
                />
              ))}
              {tasksDaFare.length === 0 && (
                <p className="text-white/60 text-center py-4">Nessun task da fare</p>
              )}
            </div>
          </div>

          {/* In corso */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ⏳ In corso <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-sm">{tasksInCorso.length}</span>
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasksInCorso.map(task => (
                <TaskCard 
                  key={task.idTask} 
                  task={task} 
                  onDelete={handleDeleteTask}
                  onChangeState={handleChangeTaskState}
                  onEdit={setEditingTask}
                  getStateName={getStateName}
                  loading={loading}
                />
              ))}
              {tasksInCorso.length === 0 && (
                <p className="text-white/60 text-center py-4">Nessun task in corso</p>
              )}
            </div>
          </div>

          {/* Completati */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ✅ Completati <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">{tasksCompletati.length}</span>
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tasksCompletati.map(task => (
                <TaskCard 
                  key={task.idTask} 
                  task={task} 
                  onDelete={handleDeleteTask}
                  onChangeState={handleChangeTaskState}
                  onEdit={setEditingTask}
                  getStateName={getStateName}
                  loading={loading}
                />
              ))}
              {tasksCompletati.length === 0 && (
                <p className="text-white/60 text-center py-4">Nessun task completato</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal modifica task */}
      {editingTask && (
        <EditTaskModal 
          task={editingTask}
          onSave={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          loading={loading}
        />
      )}

      {/* Particelle decorative */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

// Componente TaskCard
interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onChangeState: (id: number, state: number) => void;
  onEdit: (task: UpdateTaskData) => void;
  getStateName: (state: number) => { name: string; color: string; emoji: string };
  loading: boolean;
}

function TaskCard({ task, onDelete, onChangeState, onEdit, getStateName, loading }: TaskCardProps) {
  const state = getStateName(task.stateID);
  
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white truncate">{task.nome_task}</h4>
        <div className="flex gap-1">
          {/* Bottoni cambio stato */}
          {task.stateID !== 0 && (
            <button
              onClick={() => onChangeState(task.idTask, 0)}
              disabled={loading}
              className="text-red-400 hover:text-red-300 disabled:opacity-50"
              title="Segna come da fare"
            >📋</button>
          )}
          {task.stateID !== 1 && (
            <button
              onClick={() => onChangeState(task.idTask, 1)}
              disabled={loading}
              className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
              title="Segna come in corso"
            >⏳</button>
          )}
          {task.stateID !== 2 && (
            <button
              onClick={() => onChangeState(task.idTask, 2)}
              disabled={loading}
              className="text-green-400 hover:text-green-300 disabled:opacity-50"
              title="Segna come completato"
            >✅</button>
          )}
          
          {/* Bottoni azioni */}
          <button
            onClick={() => onEdit({
              idTask: task.idTask,
              nome_task: task.nome_task,
              descrizione: task.descrizione,
              data_fine: task.data_fine.toISOString().split('T')[0]
            })}
            disabled={loading}
            className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
            title="Modifica"
          >✏️</button>
          <button
            onClick={() => onDelete(task.idTask)}
            disabled={loading}
            className="text-red-400 hover:text-red-300 disabled:opacity-50"
            title="Elimina"
          >🗑️</button>
        </div>
      </div>
      
      <p className="text-white/70 text-sm mb-2">{task.descrizione}</p>
      
      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-1 rounded-full text-white text-xs ${state.color}`}>
          {state.emoji} {state.name}
        </span>
        <span className="text-white/50">
          Scade: {task.data_fine.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

// Modal modifica task
interface EditTaskModalProps {
  task: UpdateTaskData;
  onSave: (task: UpdateTaskData) => void;
  onCancel: () => void;
  loading: boolean;
}

function EditTaskModal({ task, onSave, onCancel, loading }: EditTaskModalProps) {
  const [editData, setEditData] = useState(task);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">✏️ Modifica Task</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={editData.nome_task || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, nome_task: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
            placeholder="Nome task..."
            required
            disabled={loading}
          />
          <textarea
            value={editData.descrizione || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, descrizione: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none resize-none"
            placeholder="Descrizione..."
            rows={3}
            disabled={loading}
          />
          <input
            type="date"
            value={editData.data_fine || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, data_fine: e.target.value }))}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500/80 hover:bg-green-500 text-white py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '⏳ Salvando...' : '💾 Salva'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-gray-500/80 hover:bg-gray-500 text-white py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              ❌ Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskManager;