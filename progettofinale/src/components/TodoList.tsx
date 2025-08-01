import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { caricaTasks } from "../redux/TasksSlice";
import TodoItem from "./TodoItem";
import type { Task } from "../model/Classes";
import { ClipboardDocumentListIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TodoList() {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.user);
    const allTasks = useAppSelector((state) => state.todos);
    const [loading, setLoading] = useState(false);

    // Filtra i task per l'utente corrente
    const userTasks = allTasks.filter(task => task.userID === currentUser?.idUtente);

    // Statistiche
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(task => task.stateID === 2).length;
    const inProgressTasks = userTasks.filter(task => task.stateID === 1).length;
    const todoTasks = userTasks.filter(task => task.stateID === 0).length;
    
    const overdueTasks = userTasks.filter(task => 
        task.stateID !== 2 && 
        task.data_fine && 
        new Date(task.data_fine) < new Date()
    ).length;

    const todayTasks = userTasks.filter(task => 
        task.stateID !== 2 && 
        task.data_fine && 
        task.data_fine.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
    ).length;

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const loadTasksFromDB = async () => {
        if (!currentUser) return;

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/tasks/user/${currentUser.idUtente}`);
            
            if (!response.ok) throw new Error('Errore nel caricamento task');
            
            const tasksFromDB: Task[] = await response.json();
            
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

    useEffect(() => {
        if (currentUser) {
            loadTasksFromDB();
        }
    }, [currentUser]);

    // Ordina i task
    const sortedTasks = [...userTasks].sort((a, b) => {
        const aOverdue = a.stateID !== 2 && new Date(a.data_fine) < new Date();
        const bOverdue = b.stateID !== 2 && new Date(b.data_fine) < new Date();
        
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        
        return new Date(a.data_fine).getTime() - new Date(b.data_fine).getTime();
    });

    if (totalTasks === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-400/20 to-gray-600/20 rounded-3xl mb-6">
                    <ClipboardDocumentListIcon className="h-12 w-12 text-white/60" />
                </div>
                <h3 className="text-2xl font-bold text-white/80 mb-2">
                    Nessun task ancora! 📝
                </h3>
                <p className="text-white/60 text-lg mb-6">
                    Aggiungi il tuo primo task per iniziare
                </p>
                <button
                    onClick={loadTasksFromDB}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-xl backdrop-blur-sm border border-blue-400/30 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                            <span>Caricamento...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <ArrowPathIcon className="h-4 w-4" />
                            <span>Ricarica Tasks</span>
                        </div>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">Totale Tasks</p>
                            <p className="text-2xl font-bold text-white">{totalTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">Completati</p>
                            <p className="text-2xl font-bold text-white">{completedTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">✅</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">In Corso</p>
                            <p className="text-2xl font-bold text-white">{inProgressTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">⏳</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-sm">Scaduti</p>
                            <p className="text-2xl font-bold text-white">{overdueTasks}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">🚨</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">I tuoi progressi</h3>
                        <p className="text-white/70">
                            {completedTasks} di {totalTasks} task completati
                        </p>
                        {todayTasks > 0 && (
                            <p className="text-yellow-400 text-sm mt-1">
                                📅 {todayTasks} task scadono oggi
                            </p>
                        )}
                        {overdueTasks > 0 && (
                            <p className="text-red-400 text-sm mt-1">
                                🚨 {overdueTasks} task scaduti
                            </p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {completionPercentage}%
                            </span>
                        </div>
                        
                        <button
                            onClick={loadTasksFromDB}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-xl backdrop-blur-sm border border-blue-400/30 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                </div>
                            ) : (
                                <ArrowPathIcon className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>

                <div className="flex justify-between mt-3 text-sm text-white/60">
                    <span>📋 Da fare: {todoTasks}</span>
                    <span>⏳ In corso: {inProgressTasks}</span>
                    <span>✅ Completati: {completedTasks}</span>
                </div>
            </div>

            {(overdueTasks > 0 || todayTasks > 0) && (
                <div className="bg-gradient-to-r from-red-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30 p-4">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        ⚠️ Attenzione richiesta
                    </h3>
                    <div className="space-y-1 text-sm">
                        {overdueTasks > 0 && (
                            <p className="text-red-300">
                                🚨 Hai {overdueTasks} task scaduti che necessitano attenzione
                            </p>
                        )}
                        {todayTasks > 0 && (
                            <p className="text-yellow-300">
                                📅 Hai {todayTasks} task che scadono oggi
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">I tuoi task</h3>
                    <span className="text-white/60 text-sm">
                        Ordinati per priorità e scadenza
                    </span>
                </div>
                
                <ul className="space-y-4">
                    {sortedTasks.map((task) => (
                        <li key={task.idTask}>
                            <TodoItem task={task} />
                        </li>
                    ))}
                </ul>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 flex items-center gap-3">
                        <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                        <span className="text-white font-medium">Caricamento tasks...</span>
                    </div>
                </div>
            )}
        </div>
    );
}