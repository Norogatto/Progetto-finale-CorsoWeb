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
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

type NewTaskData = {
  nome_task: string;
  descrizione: string;
  data_fine: string; 
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

  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);
  const tasks = useAppSelector((state) => state.todos);

  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskData>({
    nome_task: '',
    descrizione: '',
    data_fine: new Date().toISOString().split('T')[0]
  });
  const [editingTask, setEditingTask] = useState<UpdateTaskData | null>(null);

  // Controllo autenticazione
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      console.log('Utente non autenticato, reindirizzamento al login');
      navigate('/Login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log('Caricamento task per utente autenticato:', currentUser.idUtente);
      loadTasksFromDB();
    }
  }, [currentUser, isAuthenticated]);


  const checkAuth = (): boolean => {
    if (!isAuthenticated || !currentUser) {
      console.error('❌ Operazione negata: utente non autenticato');
      navigate('/Login');
      return false;
    }
    return true;
  };

  // Carica tutti i task dell'utente dal DB
  const loadTasksFromDB = async () => {
    if (!checkAuth()) return;

    try {
      setLoading(true);
      console.log(`Caricamento task per utente ${currentUser!.idUtente}`);

      const response = await fetch(`http://localhost:8080/api/tasks/user/${currentUser!.idUtente}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const tasksFromDB: Task[] = await response.json();
      console.log(`Caricati ${tasksFromDB.length} task dal database`);

      // Converte le date string in oggetti Date
      const processedTasks = tasksFromDB.map(task => ({
        ...task,
        data_aggiunta: new Date(task.data_aggiunta),
        data_fine: new Date(task.data_fine)
      }));

      if (isAuthenticated && currentUser) {
        dispatch(caricaTasks(processedTasks));
      }
    } catch (error) {
      console.error('Errore caricamento task:', error);
      alert('Errore nel caricamento dei task. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  // Aggiungi nuovo task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkAuth() || !newTask.nome_task.trim()) return;

    try {
      setLoading(true);

      const taskToSend = {
        userID: currentUser!.idUtente,
        stateID: 0,
        nome_task: newTask.nome_task.trim(),
        descrizione: newTask.descrizione.trim(),
        data_fine: newTask.data_fine
      };

      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const createdTask: Task = await response.json();
      console.log('Task creato:', createdTask.idTask);

      if (isAuthenticated && currentUser) {
        dispatch(aggiungiTodo({
          idTask: createdTask.idTask,
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
      }

    } catch (error) {
      console.error('Errore aggiunta task:', error);
      if (error instanceof Error) {
        alert(`Errore nell'aggiunta del task: ${error.message}`);
      } else {
        alert('Errore sconosciuto durante l\'aggiunta del task');
      }
    } finally {
      setLoading(false);
    }
  };

  // Elimina task
  const handleDeleteTask = async (idTask: number) => {
    if (!checkAuth()) return;

    if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

    try {
      setLoading(true);
      console.log(`🗑️ Eliminazione task ${idTask}...`);

      const response = await fetch(`http://localhost:8080/api/tasks/${idTask}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (isAuthenticated && currentUser) {
        dispatch(rimuoviTodo(idTask));
      }

    } catch (error) {
      console.error('Errore eliminazione task:', error);
      if (error instanceof Error) {
        alert(`Errore nell'eliminazione del task: ${error.message}`);
      } else {
        alert('Errore sconosciuto durante l\'eliminazione del task');
      }
    }
    finally {
      setLoading(false);
    }
  };

  // Cambia stato task
  const handleChangeTaskState = async (idTask: number, newStateID: number) => {
    if (!checkAuth()) return;

    try {
      setLoading(true);
      console.log(`Cambio stato task ${idTask} a ${newStateID}...`);

      const response = await fetch(`http://localhost:8080/api/tasks/${idTask}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateID: newStateID })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      console.log(`Stato task ${idTask} cambiato a ${newStateID}`);

      if (isAuthenticated && currentUser) {
        dispatch(cambiaStatoTask({ idTask, stateID: newStateID }));
      }

    } catch (error) {
      console.error('Errore cambio stato:', error);
      if (error instanceof Error) {
        alert(`Errore nel cambio di stato: ${error.message}`);
      } else {
        alert('Errore sconosciuto nel cambio di stato');
      }
    }
    finally {
      setLoading(false);
    }
  };

  // Modifica task
  const handleUpdateTask = async (updateData: UpdateTaskData) => {
    if (!checkAuth()) return;

    try {
      setLoading(true);
      console.log(`Modifica task ${updateData.idTask}...`);

      const response = await fetch(`http://localhost:8080/api/tasks/${updateData.idTask}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_task: updateData.nome_task?.trim(),
          descrizione: updateData.descrizione?.trim(),
          data_fine: updateData.data_fine
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      console.log(`Task ${updateData.idTask} modificato`);

      if (isAuthenticated && currentUser) {
        dispatch(modificaTask({
          idTask: updateData.idTask,
          nome_task: updateData.nome_task,
          descrizione: updateData.descrizione,
          data_fine: updateData.data_fine ? new Date(updateData.data_fine) : undefined
        }));
      }

      setEditingTask(null);

    } catch (error) {
      console.error('Errore modifica task:', error);
      if (error instanceof Error) {
        alert(`Errore nella modifica del task: ${error.message}`);
      } else {
        alert('Errore sconosciuto nella modifica del task');
      }
    }
    finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    console.log('Logout utente');
    dispatch(logout());
    navigate('/Login');
  };

  // Helper per ottenere il nome dello stato
  const getStateName = (stateID: number) => {
    switch (stateID) {
      case 0: return { name: 'Da fare', color: 'bg-red-500', icon: ClipboardDocumentListIcon };
      case 1: return { name: 'In corso', color: 'bg-yellow-500', icon: ClockIcon };
      case 2: return { name: 'Completato', color: 'bg-green-500', icon: CheckCircleIcon };
      default: return { name: 'Sconosciuto', color: 'bg-gray-500', icon: ClipboardDocumentListIcon };
    }
  };

  // Filtra task per stato
  const userTasks = isAuthenticated && currentUser
    ? tasks.filter(task => task.userID === currentUser.idUtente)
    : [];

  const tasksDaFare = userTasks.filter(task => task.stateID === 0);
  const tasksInCorso = userTasks.filter(task => task.stateID === 1);
  const tasksCompletati = userTasks.filter(task => task.stateID === 2);

  if (!currentUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl flex items-center gap-3">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full"></div>
          Verifica autenticazione...
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Sezione Crea Task */}
          <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Crea Task</h2>
            <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newTask.data_fine}
                  onChange={(e) => setNewTask(prev => ({ ...prev, data_fine: e.target.value }))}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !newTask.nome_task.trim()}
                  className="px-6 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-xl border border-green-400/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  ) : (
                    <PlusIcon className="h-5 w-5" />
                  )}
                  <span>Aggiungi</span>
                </button>
              </div>
            </form>
          </div>
          
          {/* Sezione Task */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonna Task Da Fare */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardDocumentListIcon className="h-6 w-6 text-red-400" />
                <h2 className="text-xl font-bold">Task Da Fare</h2>
                <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full">
                  {tasksDaFare.length}
                </span>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                  <p className="text-white/60 text-center py-4 italic">Nessun task da fare</p>
                )}
              </div>
            </div>
            
            {/* Colonna Task In Corso */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
                <h2 className="text-xl font-bold">Task In Corso</h2>
                <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                  {tasksInCorso.length}
                </span>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                  <p className="text-white/60 text-center py-4 italic">Nessun task in corso</p>
                )}
              </div>
            </div>
            
            {/* Colonna Task Completati */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                <h2 className="text-xl font-bold">Task Completati</h2>
                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">
                  {tasksCompletati.length}
                </span>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                  <p className="text-white/60 text-center py-4 italic">Nessun task completato</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onSave={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            loading={loading}
          />
        )}
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
  getStateName: (state: number) => { name: string; color: string; icon: any };
  loading: boolean;
}

function TaskCard({ task, onDelete, onChangeState, onEdit, getStateName, loading }: TaskCardProps) {
  const state = getStateName(task.stateID);
  const StateIcon = state.icon;

  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-white/40 transition-all duration-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white truncate">{task.nome_task}</h4>
        <div className="flex gap-1">
          {task.stateID !== 0 && (
            <button
              onClick={() => onChangeState(task.idTask, 0)}
              disabled={loading}
              className="text-red-400 hover:text-red-300 disabled:opacity-50 p-1"
              title="Segna come da fare"
            >
              <ClipboardDocumentListIcon className="h-4 w-4" />
            </button>
          )}
          {task.stateID !== 1 && (
            <button
              onClick={() => onChangeState(task.idTask, 1)}
              disabled={loading}
              className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 p-1"
              title="Segna come in corso"
            >
              <ClockIcon className="h-4 w-4" />
            </button>
          )}
          {task.stateID !== 2 && (
            <button
              onClick={() => onChangeState(task.idTask, 2)}
              disabled={loading}
              className="text-green-400 hover:text-green-300 disabled:opacity-50 p-1"
              title="Segna come completato"
            >
              <CheckCircleIcon className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => onEdit({
              idTask: task.idTask,
              nome_task: task.nome_task,
              descrizione: task.descrizione,
              data_fine: task.data_fine.toISOString().split('T')[0]
            })}
            disabled={loading}
            className="text-blue-400 hover:text-blue-300 disabled:opacity-50 p-1"
            title="Modifica"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.idTask)}
            disabled={loading}
            className="text-red-400 hover:text-red-300 disabled:opacity-50 p-1"
            title="Elimina"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="text-white/70 text-sm mb-2">{task.descrizione}</p>

      <div className="flex justify-between items-center text-xs">
        <span className={`px-2 py-1 rounded-full text-white text-xs ${state.color} flex items-center gap-1`}>
          <StateIcon className="h-3 w-3" /> {state.name}
        </span>
        <span className="text-white/50">
          Scade: {task.data_fine.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

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