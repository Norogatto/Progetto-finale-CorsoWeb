import './App.css'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accesso from '';

function App() {

  return (
 <Home> 
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/utente" element={ *****/>} />
      </Routes>
    </BrowserRouter>
  </Home>

  )
}

export default App