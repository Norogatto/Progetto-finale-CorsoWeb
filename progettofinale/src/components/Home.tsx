import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/todoSlice';
import { Link } from 'react-router-dom';

function Home() {
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Benvenuto in Task Master</h1>
            <p>Organizza le tue task con semplicità</p>
            <div className="space-y-4">
                <button onClick={() => dispatch(setCurrentUser(0))}>
                    <Link to="/home">Accedi come ospite</Link>
                </button>
            </div>
        </div>
    );
}
export default Home;


