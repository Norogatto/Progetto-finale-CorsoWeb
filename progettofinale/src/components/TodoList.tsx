import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import TodoItem from "./TodoItem";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function TodoList() {
    const todos = useSelector((state: RootState) => state.todos);

    if (todos.length === 0) {
        return (
            <div
                className="text-center py-16"
                >
                <div
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-400/20 to-gray-600/20 rounded-3xl mb-6"
                >
                    <ClipboardDocumentListIcon className="h-12 w-12 text-white/60" />
                </div>
                <h3
                    className="text-2xl font-bold text-white/80 mb-2"
                    >
                    Nessun task ancora! 📝
                </h3>
                <p
                    className="text-white/60 text-lg"
                    >
                    Aggiungi il tuo primo task per iniziare
                </p>
            </div>
        );
    }

    return (
        <div>
            <div
                className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Le tue attività</h3>
                        <p className="text-white/70">
                            {todos.filter(t => t.completato).length} di {todos.length} completati
                        </p>
                    </div>
                    <div
                        className="flex items-center gap-3"
                        >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                                {Math.round((todos.filter(t => t.completato).length / todos.length) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                        />
                </div>
            </div>

            {/* Todo list */}
            <ul
                className="space-y-4"
            >
                {todos.map((todo, index) => (
                    <li
                        key={todo.id}
                        >
                        <TodoItem todo={todo} index={index} />
                    </li>
                ))}
            </ul>
        </div>
    );
}