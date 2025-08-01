import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import {
  rimuoviTodo,
  cambiaStatoTask,
  modificaTask,
} from '../redux/TasksSlice';
import type { Task } from '../model/Classes';
import {
  CheckCircleIcon,
  TrashIcon,
  CalendarDaysIcon,
  ClockIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

type Props = {
  task: Task;
};

type UpdateTaskData = {
  idTask: number;
  nome_task?: string;
  descrizione?: string;
  data_fine?: string;
};

export default function TodoItem({ task }: Props) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome_task: task.nome_task,
    descrizione: task.descrizione,
    data_fine: task.data_fine.toISOString().split('T')[0]
  });

  // Verifica se il task è scaduto
  const isScaduto = task.stateID !== 2 && task.data_fine && new Date(task.data_fine) < new Date();
  const isOggi = task.data_fine && task.data_fine.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

  const getStatusColor = () => {
    switch (task.stateID) {
      case 0: return isScaduto ? 'from-red-400 to-pink-500' : isOggi ? 'from-yellow-400 to-orange-500' : 'from-blue-400 to-purple-500'; // Da fare
      case 1: return 'from-yellow-400 to-orange-500'; 
      case 2: return 'from-green-400 to-emerald-500'; 
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStateName = (stateID: number) => {
    switch (stateID) {
      case 0: return { name: 'Da fare', emoji: '📋' };
      case 1: return { name: 'In corso', emoji: '⏳' };
      case 2: return { name: 'Completato', emoji: '✅' };
      default: return { name: 'Sconosciuto', emoji: '❓' };
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // Cambia stato task
  const handleChangeTaskState = async (newStateID: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/tasks/${task.idTask}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateID: newStateID })
      });

      if (!response.ok) throw new Error('Errore nel cambio stato');
      
      dispatch(cambiaStatoTask({ idTask: task.idTask, stateID: newStateID }));

    } catch (error) {
      console.error('Errore cambio stato:', error);
      alert('Errore nel cambio di stato');
    } finally {
      setLoading(false);
    }
  };

  // Elimina task
  const handleDeleteTask = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo task?')) return;

    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/tasks/${task.idTask}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Errore nell\'eliminazione del task');
      
      dispatch(rimuoviTodo(task.idTask));

    } catch (error) {
      console.error('Errore eliminazione task:', error);
      alert('Errore nell\'eliminazione del task');
    } finally {
      setLoading(false);
    }
  };

  // Modifica task
  const handleUpdateTask = async () => {
    try {
      setLoading(true);
      
      const updateData: UpdateTaskData = {
        idTask: task.idTask,
        nome_task: editData.nome_task,
        descrizione: editData.descrizione,
        data_fine: editData.data_fine
      };

      const response = await fetch(`http://localhost:8080/api/tasks/${task.idTask}`, {
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

      setIsEditing(false);

    } catch (error) {
      console.error('Errore modifica task:', error);
      alert('Errore nella modifica del task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      nome_task: task.nome_task,
      descrizione: task.descrizione,
      data_fine: task.data_fine.toISOString().split('T')[0]
    });
    setIsEditing(false);
  };

  const state = getStateName(task.stateID);

  return (
    <div
      className={`relative bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-md px-4 py-5 transition-all duration-300 ${
        task.stateID === 2 ? 'opacity-80' : ''
      }`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${getStatusColor()}`} />

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.nome_task}
            onChange={(e) => setEditData(prev => ({ ...prev, nome_task: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:border-blue-400 focus:outline-none"
            placeholder="Nome task..."
            disabled={loading}
          />
          <textarea
            value={editData.descrizione}
            onChange={(e) => setEditData(prev => ({ ...prev, descrizione: e.target.value }))}
            className="w-full px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:border-blue-400 focus:outline-none resize-none"
            placeholder="Descrizione..."
            rows={2}
            disabled={loading}
          />
          <input
            type="date"
            value={editData.data_fine}
            onChange={(e) => setEditData(prev => ({ ...prev, data_fine: e.target.value }))}
            className="px-3 py-2 bg-white/20 text-white rounded-lg border border-white/30 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdateTask}
              disabled={loading}
              className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {loading ? '⏳' : '💾 Salva'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={loading}
              className="px-4 py-2 bg-gray-500/80 hover:bg-gray-500 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              ❌ Annulla
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <button 
                onClick={() => handleChangeTaskState(task.stateID === 2 ? 0 : task.stateID + 1)}
                disabled={loading}
                className="shrink-0 mt-1"
              >
                {task.stateID === 2 ? (
                  <CheckCircleSolid className="h-6 w-6 text-green-400" />
                ) : (
                  <CheckCircleIcon className="h-6 w-6 text-white/60 hover:text-green-300 transition-colors" />
                )}
              </button>

              <div className="flex-1">
                <p className={`text-base font-semibold ${
                  task.stateID === 2 ? 'text-white/50 line-through' : 'text-white'
                }`}>
                  {task.nome_task}
                </p>
                <p className="text-white/70 text-sm mt-1">{task.descrizione}</p>

                <div className="text-xs text-white/40 mt-2 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>Aggiunto: {formatDate(task.data_aggiunta)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>Scade: {formatDate(task.data_fine)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    task.stateID === 0 ? 'bg-blue-500' : 
                    task.stateID === 1 ? 'bg-yellow-500' : 'bg-green-500'
                  } text-white`}>
                    {state.emoji} {state.name}
                  </span>
                  
                  {isScaduto && task.stateID !== 2 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                      🚨 Scaduto
                    </span>
                  )}
                  {isOggi && task.stateID !== 2 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-300 text-black rounded-full">
                      📅 Scade oggi
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              {task.stateID !== 0 && (
                <button
                  onClick={() => handleChangeTaskState(0)}
                  disabled={loading}
                  className="text-blue-400 hover:text-blue-300 disabled:opacity-50 text-sm"
                  title="Segna come da fare"
                >📋</button>
              )}
              {task.stateID !== 1 && (
                <button
                  onClick={() => handleChangeTaskState(1)}
                  disabled={loading}
                  className="text-yellow-400 hover:text-yellow-300 disabled:opacity-50 text-sm"
                  title="Segna come in corso"
                >⏳</button>
              )}
              {task.stateID !== 2 && (
                <button
                  onClick={() => handleChangeTaskState(2)}
                  disabled={loading}
                  className="text-green-400 hover:text-green-300 disabled:opacity-50 text-sm"
                  title="Segna come completato"
                >✅</button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                title="Modifica"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleDeleteTask}
                disabled={loading}
                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                title="Elimina"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
        </div>
      )}
    </div>
  );
}