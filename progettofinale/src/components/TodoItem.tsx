import { useDispatch } from 'react-redux';
import { rimuoviTodo, toggleCompletato, type Todo, setDataScadenza, setDataCompletamento } from '../redux/todoSlice';
import { type AppDispatch } from '../redux/store';
import { CheckCircleIcon, TrashIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

type Props = {
    todo: Todo;
    index: number;
};

export default function TodoItem({ todo }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const [dataScadenzaInput, setDataScadenzaInput] = useState(todo.dataScadenza || '');


    const isScaduto = !todo.completato && todo.dataScadenza && new Date(todo.dataScadenza) < new Date();
    const isOggi = todo.dataScadenza === new Date().toISOString().split('T')[0];

    // Colori dinamici basati sullo stato
    const getStatusColor = () => {
        if (todo.completato) return 'from-green-400 to-emerald-500';
        if (isScaduto) return 'from-red-400 to-pink-500';
        if (isOggi) return 'from-yellow-400 to-orange-500';
        return 'from-blue-400 to-purple-500';
    };

    const getStatusIcon = () => {
        if (todo.completato) return '✅';
        if (isScaduto) return '⚠️';
        if (isOggi) return '⏰';
        return '📋';
    };

    const handleToggleCompletato = () => {
        dispatch(toggleCompletato({ id: todo.id, completato: !todo.completato }));
        if (!todo.completato) {
            dispatch(setDataCompletamento({ id: todo.id, dataCompletamento: new Date().toISOString().split('T')[0] }));
        } else {
            dispatch(setDataCompletamento({ id: todo.id, dataCompletamento: undefined }));
        }
    };

    const handleDataScadenzaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDataScadenzaInput(e.target.value);
    };

    const handleDataScadenzaBlur = () => {
        if (dataScadenzaInput !== todo.dataScadenza) {
            dispatch(setDataScadenza({ id: todo.id, dataScadenza: dataScadenzaInput }));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div
            className={`group relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                todo.completato ? 'opacity-90' : ''
            }`}
            >
            {/* Status gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusColor()}`} />

            {/* Status indicator */}
            <div className="absolute top-4 left-4 text-2xl">
                {getStatusIcon()}
            </div>

            <div className="p-6 pl-16">
                {/* Main content */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        {/* Todo text */}
                        <div>
                            <button
                                onClick={handleToggleCompletato}
                            >
                                {todo.completato ? (
                                    <CheckCircleSolid className="h-7 w-7 text-green-400" />
                                ) : (
                                    <CheckCircleIcon className="h-7 w-7 text-white/50 hover:text-green-400 transition-colors" />
                                )}
                            </button>
                            <span className={`text-lg font-semibold ${
                                todo.completato
                                    ? 'text-white/60 line-through'
                                    : 'text-white'
                            }`}>
                {todo.testo}
              </span>
                        </div>

                        {/* Date info */}
                        <div>
                            <div>
                                <CalendarDaysIcon/>
                                <span>Aggiunto: {formatDate(todo.dataAggiunta)}</span>
                            </div>
                            {todo.dataCompletamento && (
                                <div>
                                    <CheckCircleIcon/>
                                    <span>Completato: {formatDate(todo.dataCompletamento)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        {/* Date picker */}
                        <div>
                            <input
                                type="date"
                                value={dataScadenzaInput}
                                onChange={handleDataScadenzaChange}
                                onBlur={handleDataScadenzaBlur}
                               />
                            <ClockIcon/>
                        </div>

                        {/* Delete button */}
                        <button
                            onClick={() => dispatch(rimuoviTodo(todo.id))}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400/50"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-2 mt-4">
                    {isScaduto && (
                        <span
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium"
                        >
                            Scaduto
                        </span>
                    )}
                    {isOggi && !todo.completato && (
                        <span
                            className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium"
                            >
                            Scade oggi
                        </span>
                    )}
                    {todo.completato && (
                        <span
                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium"
                           >
                            Completato
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}