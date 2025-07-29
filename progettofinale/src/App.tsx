import './App.css'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
//import Accesso from '';

function App() {

  return (
<>
 <Home> 
  </Home>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/utente"  />
      </Routes>
    </BrowserRouter>
</>
  )
}
export default App;