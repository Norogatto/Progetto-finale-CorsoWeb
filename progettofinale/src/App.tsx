import './App.css';
import Home from './components/Home';
import AppHome from './components/AppHome';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<AppHome />} />
        </Routes>
    );
}
export default App;
