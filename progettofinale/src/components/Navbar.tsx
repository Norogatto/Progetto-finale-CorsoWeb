import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/userSlice';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    console.log('Logout utente');
    dispatch(logout());
    navigate('/Login');
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-white text-2xl font-bold flex items-center">
            <span className="mr-2">✓</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Task Master</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          {isAuthenticated && currentUser ? (
            <>
              <span className="hidden md:inline-block text-indigo-100 font-medium">
                Benvenuto, <span className="font-semibold">{currentUser.nome} {currentUser.cognome}</span>
              </span>
              <Link to="/TaskManager" className="text-white hover:text-indigo-200 font-medium transition">
                Task Manager
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition flex items-center"
              >
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" className="text-white hover:text-indigo-200 font-medium transition">
                Login
              </Link>
              <Link 
                to="/Register" 
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
              >
                Registrati
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}