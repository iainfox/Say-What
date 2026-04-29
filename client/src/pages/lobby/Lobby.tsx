import './Lobby.css'
import { useParams } from "react-router-dom";

function Lobby() {
    const { code } = useParams();

    return (
        <div>
            <h1>Lobby: {code}</h1>
        </div>
    );
}

export default Lobby;