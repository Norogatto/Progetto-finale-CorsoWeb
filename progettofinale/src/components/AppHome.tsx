import TaskForm from './TaskForm';
import TaskList from './TaskList';

function AppHome() {
  return (
      <div
          className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          />
          <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-600/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                🚀 Task Master
              </h1>
              <p className="text-white/80">
                Organizza le tue attività con stile
              </p>
            </div>

            <TaskForm />
            <TaskList />
          </div>
        </div>

        {[...Array(6)].map((_, i) => (
            <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
            />
        ))}
      </div>
  );
}

export default AppHome;