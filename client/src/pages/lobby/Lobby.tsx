import './Lobby.css'
import { useParams } from "react-router-dom";

function Lobby() {
    const { code } = useParams();

    return (
        <>
            <header className={"lobby-header"}>
                <span className='logo'>Say What Logo</span>

                <h2 className='title'>Lobby Code: {code}</h2>
            </header>
        </>
    );
}

export default Lobby;