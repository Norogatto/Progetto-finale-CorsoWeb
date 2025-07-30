import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';
import type { Task } from '../redux/todoSlice';
import TaskItem from './TaskItem';

export default function TaskList() {
    const tasks = useSelector((state: RootState) => state.todo.tasks);
    const currentUser = useSelector((state: RootState) => state.todo.currentUser);

    // Filtra le task dell'utente corrente (se loggato)
    const userTasks = currentUser
        ? tasks.filter(task => task.userID === currentUser)
        : tasks; // Se non loggato, mostra tutte le task

    if (userTasks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white/80 mb-2">
                    Nessuna task ancora
                </h3>
                <p className="text-white/60">
                    Aggiungi la tua prima task per iniziare!
                </p>
            </div>
        );
    }

    // Raggruppa le task per stato
    const tasksByState = {
        daDare: userTasks.filter(task => task.stateID === 1),
        inCorso: userTasks.filter(task => task.stateID === 2),
        completate: userTasks.filter(task => task.stateID === 3)
    };

    const StateSection = ({ title, tasks, emoji }: { title: string; tasks: Task[]; emoji: string }) => (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                <span className="text-2xl">{emoji}</span>
                {title} ({tasks.length})
            </h3>
            <div className="space-y-4">
                {tasks.map(task => (
                    <TaskItem key={task.idTask} idTask={task.idTask} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="mt-8">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white/90 mb-2">
                    Le tue Task
                </h2>
                <p className="text-white/60">
                    Totale: {userTasks.length} task
                </p>
            </div>

            {/* Task da fare */}
            {tasksByState.daDare.length > 0 && (
                <StateSection
                    title="Da fare"
                    tasks={tasksByState.daDare}
                    emoji="📋"
                />
            )}

            {/* Task in corso */}
            {tasksByState.inCorso.length > 0 && (
                <StateSection
                    title="In corso"
                    tasks={tasksByState.inCorso}
                    emoji="⏳"
                />
            )}

            {/* Task completate */}
            {tasksByState.completate.length > 0 && (
                <StateSection
                    title="Completate"
                    tasks={tasksByState.completate}
                    emoji="✅"
                />
            )}
        </div>
    );
}