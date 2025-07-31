import { useDispatch } from 'react-redux';
import {
  rimuoviTodo,
  toggleCompletato,
  type Todo,
  setDataScadenza,
  setDataCompletamento,
} from '../redux/todoSlice';
import { type AppDispatch } from '../redux/store';
import {
  CheckCircleIcon,
  TrashIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [dataScadenzaInput, setDataScadenzaInput] = useState(todo.dataScadenza || '');

  const isScaduto = !todo.completato && todo.dataScadenza && new Date(todo.dataScadenza) < new Date();
  const isOggi = todo.dataScadenza === new Date().toISOString().split('T')[0];

  const getStatusColor = () => {
    if (todo.completato) return 'from-green-400 to-emerald-500';
    if (isScaduto) return 'from-red-400 to-pink-500';
    if (isOggi) return 'from-yellow-400 to-orange-500';
    return 'from-blue-400 to-purple-500';
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const handleToggleCompletato = () => {
    dispatch(toggleCompletato({ id: todo.id, completato: !todo.completato }));
    dispatch(
      setDataCompletamento({
        id: todo.id,
        dataCompletamento: !todo.completato ? new Date().toISOString().split('T')[0] : undefined,
      })
    );
  };

  const handleDataScadenzaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataScadenzaInput(e.target.value);
  };

  const handleDataScadenzaBlur = () => {
    if (dataScadenzaInput !== todo.dataScadenza) {
      dispatch(setDataScadenza({ id: todo.id, dataScadenza: dataScadenzaInput }));
    }
  };

  return (
    <div
      className={`relative bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-md px-4 py-5 transition-all duration-300 ${
        todo.completato ? 'opacity-80' : ''
      }`}
    >
      {/* Gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r ${getStatusColor()}`} />

      <div className="flex items-center justify-between gap-4">
        {/* Stato / Icona */}
        <button onClick={handleToggleCompletato} className="shrink-0">
          {todo.completato ? (
            <CheckCircleSolid className="h-6 w-6 text-green-400" />
          ) : (
            <CheckCircleIcon className="h-6 w-6 text-white/60 hover:text-green-300" />
          )}
        </button>

        {/* Testo e date */}
        <div className="flex-1">
          <p className={`text-base font-semibold ${todo.completato ? 'text-white/50 line-through' : 'text-white'}`}>
            {todo.testo}
          </p>

          <div className="text-xs text-white/40 mt-1 space-y-0.5">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>Aggiunto: {formatDate(todo.dataAggiunta)}</span>
            </div>
            {todo.dataCompletamento && (
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Completato: {formatDate(todo.dataCompletamento)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Azioni */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dataScadenzaInput}
              onChange={handleDataScadenzaChange}
              onBlur={handleDataScadenzaBlur}
              className="bg-white/10 text-white text-xs rounded-md px-2 py-1 outline-none border border-white/10 focus:ring-1 focus:ring-white/20"
            />
            <ClockIcon className="w-4 h-4 text-white/50" />
          </div>

          <button
            onClick={() => dispatch(rimuoviTodo(todo.id))}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Badge */}
      <div className="flex gap-2 mt-3">
        {isScaduto && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">Scaduto</span>
        )}
        {isOggi && !todo.completato && (
          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-300 text-black rounded-full">Scade oggi</span>
        )}
        {todo.completato && (
          <span className="px-2 py-0.5 text-xs font-medium bg-green-500 text-white rounded-full">Completato</span>
        )}
      </div>
    </div>
  );
}
