import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import Player from "./Player.js";
import LobbyManager from "./LobbyManager.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

function ensureNotInLobby(socket: any) {
	const code = LobbyManager.getLobbyFromPlayer(socket.id);
	if (!code) return;

	LobbyManager.removePlayer(socket.id);
	socket.leave(code);
	io.to(code).emit("playerLeft", socket.id);
}

function changeUsername(socket:any, username: string) {
	const lobby_code = LobbyManager.getLobbyFromPlayer(socket.id);
	if (!lobby_code) return

	const lobby = LobbyManager.getLobby(lobby_code)
	if (!lobby) return

	const player = lobby.players.filter((p) => p.socketId === socket.id)
	if (!player[0]) return

	player.map((p) => p.name = username);

	if (lobby.host.socketId === socket.id) {
		lobby.host.name = username
	}

	socket.emit("usernameChanged", username)
}

io.on("connection", (socket) => {
	socket.on("createLobby", () => {
		ensureNotInLobby(socket);

		let code = Math.random().toString(36).substring(2, 6).toUpperCase();
		while (LobbyManager.getLobby(code) !== undefined) {
			code = Math.random().toString(36).substring(2, 6).toUpperCase();
		}
 
		const host = new Player(socket.id);
		LobbyManager.createLobby(code, host);

		socket.join(code);
		socket.emit("lobbyCreated", code);
	});

	socket.on("disconnect", () => {
		ensureNotInLobby(socket);
	});

	socket.on("joinLobby", (code: string) => {
		ensureNotInLobby(socket);

		const lobby = LobbyManager.getLobby(code);
		if (!lobby) return;

		const player = new Player(socket.id);

		LobbyManager.addPlayer(code, player)

		socket.join(code);

		io.to(code).emit("playerJoined", player);
	});

	socket.on("isValidLobby", (code: string) => {
		if (LobbyManager.getLobby(code)) {
			socket.emit("isValidLobby", true);
		} else {
			socket.emit("isValidLobby", false);
		}
	});

	socket.on("changeUsername", (username: string) => changeUsername(socket, username));
	socket.on("randomizeUsername", () => changeUsername(socket, Player.generateUsername()))
});

server.listen(3000, () => {
	console.log("server running on http://localhost:3000");
});