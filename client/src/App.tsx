import "./App.css";
import { getSocket } from "./socket";
import { useNavigate } from "react-router-dom";

function App() {
	const navigate = useNavigate();

	function createLobby() {
		const socket = getSocket();

		socket.once("lobbyCreated", (code) => {
			navigate(`/lobby/${code}`);
		});

		socket.emit("createLobby");
	}

	return (
		<div>
			<button onClick={createLobby}>
				Create Lobby
			</button>
		</div>
	);
}

export default App;