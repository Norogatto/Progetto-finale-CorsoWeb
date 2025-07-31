import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/userSlice";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

function TaskManager() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Ottieni l'utente dallo store Redux
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);

  // Reindirizza al login se non autenticato
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/Login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/Login');
  };

  // Se non c'è utente, non renderizzare nulla (redirect in corso)
  if (!currentUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Header con informazioni utente e logout */}
      <div className="container mx-auto max-w-4xl relative z-10 mb-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-white">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-white/80 mt-1">
                Benvenuto, {currentUser.nome} {currentUser.cognome}!
              </p>
              <p className="text-white/60 text-sm">
                {currentUser.email} | {currentUser.role ? '👑 Admin' : '👤 Utente'}
              </p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-xl backdrop-blur-sm border border-red-400/30 transition-all duration-200 hover:scale-105"
            >
              Logout
            </button>
          </div>

          
        </div>
      </div>

      {/* Effetti di background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl" />
      </div>

      {/* Contenuto principale */}
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          <TodoForm />
          <TodoList />
        </div>
      </div>

      {/* Particelle decorative */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default TaskManager;