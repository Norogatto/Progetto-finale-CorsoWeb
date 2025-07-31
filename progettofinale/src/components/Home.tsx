import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div>
        <img src="/logo.png" alt="logo" />
        <h1>Benvenuto in Task Master</h1>
        <p>Questo sito è sviluppato per organizzare al meglio le tue task</p>
      </div>

      <br /><br />

      <div>
        <Link to="/Login">
        <button>Accedi come utente</button>
        </Link>
      </div>

      <br /><br />

      <div>
        <Link to="/Register">
        <button>Registrati</button>
        </Link>
      </div>

      <br /><br />

      <div>
        <Link to="/AppHome">
          <button>Accedi come ospite</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;

