import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { aggiungiTodo } from "../redux/TasksSlice";
import { PlusIcon,SparklesIcon } from "@heroicons/react/24/outline";

type NewTaskData = {
  nome_task: string;
  descrizione: string;
  data_fine: string; 
};

export default function TodoForm() {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.user);
    
    const [loading, setLoading] = useState(false);
    const [newTask, setNewTask] = useState<NewTaskData>({
        nome_task: '',
        descrizione: '',
        data_fine: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e: React.FormEvent) => {
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
            
            const createdTask = await response.json();
            
            dispatch(aggiungiTodo({
                nome_task: createdTask.nome_task,
                descrizione: createdTask.descrizione,
                stateID: createdTask.stateID,
                userID: createdTask.userID,
                data_fine: new Date(createdTask.data_fine)
            }));

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

    return (
        <div className="mb-8">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <SparklesIcon className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    TaskMaster
                </h1>
                <p className="text-white/70 text-lg font-medium">
                    Organizza la tua giornata con stile ✨
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={newTask.nome_task}
                        onChange={(e) => setNewTask(prev => ({ ...prev, nome_task: e.target.value }))}
                        placeholder="Cosa c'è da fare oggi? 🚀"
                        className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
                        required
                        disabled={loading}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl -z-10" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newTask.descrizione}
                            onChange={(e) => setNewTask(prev => ({ ...prev, descrizione: e.target.value }))}
                            placeholder="Descrizione (opzionale) 📝"
                            className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="relative">
                        <input
                            type="date"
                            value={newTask.data_fine}
                            onChange={(e) => setNewTask(prev => ({ ...prev, data_fine: e.target.value }))}
                            className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading || !newTask.nome_task.trim()}
                        className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                                <span>Aggiungendo...</span>
                            </>
                        ) : (
                            <>
                                <PlusIcon className="h-6 w-6" />
                                <span>Aggiungi Task</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}