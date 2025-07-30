import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHome from './AppHome';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AppHome" element={<AppHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;