import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHome from './components/AppHome';
import LoginNew from './components/LoginNew';
import Registrazione from './components/Registrazione';
import TaskManager from './components/TaskManager';

function App() {
  return (
    <>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AppHome" element={<AppHome />} />
        <Route path="/Login" element={<LoginNew />} />
        <Route path="/Register" element={<Registrazione />} />
        <Route path='/TaskManager' element={<TaskManager/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;