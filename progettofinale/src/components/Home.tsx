import { Link } from 'react-router-dom';

function Home() {


  return (
<div>
        <div>
            <h1 className="font-marker text-4xl">Benvenuto in Task Master</h1>
            <p>Questo sito è sviluppato per organizzare al meglio le tue task</p>
        </div>

<br/><br/>
        <div>
            <button>Accedi come utente</button>
        </div>
<br/><br/>
        <div>
          <Link to="/****">
          <button>Accedi come ospite</button>
          </Link>
        </div>

</div>
  )
}
export default Home;

