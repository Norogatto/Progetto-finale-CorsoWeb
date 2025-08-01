import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHome from './components/AppHome';
import LoginNew from './components/LoginNew';
import Registrazione from './components/Registrazione';
import TaskManager from './components/TaskManager';
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
      <BrowserRouter>
        <Navbar />
        <div className="container mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AppHome" element={<AppHome />} />
            <Route path="/Login" element={<LoginNew />} />
            <Route path="/Register" element={<Registrazione />} />
            <Route path='/TaskManager' element={<TaskManager/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;