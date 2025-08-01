import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">✓</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Benvenuto in Task Master
        </h1>
        <p className="text-xl text-indigo-200 mb-8">
          Organizza al meglio le tue attività con la nostra piattaforma intuitiva
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link to="/Login">
            <div className="bg-gradient-to-br from-indigo-600/30 to-indigo-800/30 p-6 rounded-xl border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="text-3xl mb-3">🔑</div>
              <h3 className="text-xl font-medium mb-2">Accedi</h3>
              <p className="text-indigo-200/80 text-sm">Accedi al tuo account per gestire le tue attività</p>
            </div>
          </Link>
          
          <Link to="/Register">
            <div className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-xl font-medium mb-2">Registrati</h3>
              <p className="text-indigo-200/80 text-sm">Crea un nuovo account per iniziare a usare Task Master</p>
            </div>
          </Link>
          
          <Link to="/AppHome">
            <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 p-6 rounded-xl border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="text-3xl mb-3">👀</div>
              <h3 className="text-xl font-medium mb-2">Ospite</h3>
              <p className="text-indigo-200/80 text-sm">Prova l'applicazione senza registrarti</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;