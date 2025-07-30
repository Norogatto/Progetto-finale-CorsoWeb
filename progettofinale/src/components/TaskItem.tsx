import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store";
import { changeTaskState, removeTask, setDataFine } from "../redux/todoSlice";
import { TrashIcon } from "@heroicons/react/24/outline";
import {useState} from "react";

export default function TaskItem({ idTask }: { idTask: number }) {
    const dispatch = useDispatch<AppDispatch>();
    const task = useSelector((state: RootState) => state.todo.tasks.find(t => t.idTask === idTask));
    const stato = useSelector((state: RootState) => state.todo.states.find(s => s.idState === task?.stateID));
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (!task || !stato) return null;

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-4 space-y-2">
            <h3 className="text-xl font-semibold text-white">{task.nome_task}</h3>
            {task.descrizione && <p className="text-white/80">{task.descrizione}</p>}
            <p className="text-sm text-white/50">Aggiunta il: {task.data_aggiunta.split('T')[0]}</p>
            {task.data_fine && <p className="text-sm text-white/50">Completata il: {task.data_fine}</p>}
            <p className="text-sm text-white/70 font-semibold">Stato: {stato.nome_stato}</p>
            <div className="flex justify-end gap-2 mt-2">
                <select
                    value={task.stateID}
                    onChange={(e) => {
                        const newState = parseInt(e.target.value, 10);
                        dispatch(changeTaskState({ idTask: task.idTask, stateID: newState }));
                        setShowConfirmation(true);
                        if (newState === 3 && !task.data_fine) {
                            const today = new Date().toISOString().split('T')[0];
                            dispatch(setDataFine({ idTask: task.idTask, data_fine: today }));
                        }
                        setTimeout(() => setShowConfirmation(false), 2000);
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow"
                >
                    <option value={1}>Da fare</option>
                    <option value={2}>In corso</option>
                    <option value={3}>Completato</option>
                </select>
                {showConfirmation && (
                    <span className="text-green-400 text-sm ml-2">Stato aggiornato ✅</span>
                )}
                <button
                    onClick={() => dispatch(removeTask(task.idTask))}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow flex items-center"
                >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Elimina
                </button>
            </div>
        </div>
    );
}