import { useDispatch } from "react-redux";
import { type AppDispatch } from "../redux/store";
import { useState } from "react";
import { aggiungiTodo, ordinaTodo, ordinaTodoDecrescente } from "../redux/todoSlice";
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function TodoForm() {
    const dispatch = useDispatch<AppDispatch>();
    const [userInput, setUserInput] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (userInput.trim() !== "") {
            dispatch(aggiungiTodo(userInput));
            setUserInput("");
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
            {/* Header with icon */}
            <div>
                <div>
                    <SparklesIcon className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    TaskMaster
                </h1>
                <p className="text-white/70 text-lg font-medium">
                    Organizza la tua giornata con stile ✨
                </p>
            </div>

            {/* Input form */}
            <form
                onSubmit={handleSubmit}
                className="flex items-center mb-8 gap-4"
            >
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Cosa c'è da fare oggi? 🚀"
                        className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl -z-10"
                    />
                </div>
                <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <PlusIcon className="h-6 w-6" />
                    <span className="hidden sm:inline">Aggiungi</span>
                </button>
            </form>

            {/* Sort buttons */}
            <div
                className="flex justify-center gap-4"
                >
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