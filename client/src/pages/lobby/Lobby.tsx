import './Lobby.css';
import { useParams } from "react-router-dom";

function Lobby() {
    const { code } = useParams();

    function usernameChanged() {
        console.warn("todo");
    }

    return (
        <div className='lobby-container'>
            <header className={"lobby-header"}>
                <span className='logo'>Say What Logo</span>

                <h2 className='title'>Lobby Code: {code}</h2>
            </header>

            <div className='name-selector'>
                <h2>Say What?!</h2>
                <div className='username-input-group'>
                    <input className='username-input' autoComplete='username' id="username" type="text" onChange={usernameChanged} placeholder='Enter a username' />
                    <button className='username-randomizer' aria-label='Randomize Username'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M482-160q-134 0-228-93t-94-227v-7l-64 64-56-56 160-160 160 160-56 56-64-64v7q0 100 70.5 170T482-240q26 0 51-6t49-18l60 60q-38 22-78 33t-82 11Zm278-161L600-481l56-56 64 64v-7q0-100-70.5-170T478-720q-26 0-51 6t-49 18l-60-60q38-22 78-33t82-11q134 0 228 93t94 227v7l64-64 56 56-160 160Z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Lobby;