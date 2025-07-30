import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../redux/store";
import { useState } from "react";
import { addTask, ordinaTodo, ordinaTodoDecrescente } from "../redux/todoSlice";
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export default function TaskForm() {
    const dispatch = useDispatch<AppDispatch>();
    const [userInput, setUserInput] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const currentUser = useSelector((state: RootState) => state.todo.currentUser);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (userInput.trim() !== "" && currentUser !== null) {
            dispatch(addTask({
                nome_task: userInput,
                descrizione: descrizione.trim() || null,
                userID: currentUser,
                stateID: 1,
                data_fine: ""
            }));
            setUserInput("");
            setDescrizione("");
        }
    }

    function handleSortAsc() {
        dispatch(ordinaTodo());
    }

    function handleSortDesc() {
        dispatch(ordinaTodoDecrescente());
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Cosa c'è da fare oggi? 🚀"
                            className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
                            required
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl -z-10" />
                    </div>
                    <div className="relative">
                        <textarea
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                            placeholder="Aggiungi una descrizione (opzionale) 📝"
                            className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 resize-none"
                            rows={3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl -z-10" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="h-6 w-6" />
                        <span>Aggiungi Task</span>
                    </button>
                </div>
            </form>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleSortAsc}
                    className="group px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                    <ArrowUpIcon className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
                    <span>A-Z</span>
                </button>
                <button
                    onClick={handleSortDesc}
                    className="group px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                    <ArrowDownIcon className="h-5 w-5 group-hover:text-pink-400 transition-colors" />
                    <span>Z-A</span>
                </button>
            </div>
        </div>
    );
}