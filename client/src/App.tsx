import { useEffect } from "react";
import { socket } from "./socket";
import "./App.css"

function App() {
	useEffect(() => {
		const onConnect = () => {
			console.log("connected:", socket.id);
		};

		socket.on("connect", onConnect);

		return () => {
			socket.off("connect", onConnect);
		};
	}, []);

	return <div>Game</div>;
}

export default App
