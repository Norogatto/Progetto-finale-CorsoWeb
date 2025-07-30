import './App.css';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppHome from './AppHome';
import LoginNew from './components/LoginNew';

function App() {
  return (
    <>
    <div className="App">
            <h1>Test Login</h1>
            <LoginNew />
    </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AppHome" element={<AppHome />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;