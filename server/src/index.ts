import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import Player from "./player.js";
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

		console.log(LobbyManager.lobbies);
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
});

server.listen(3000, () => {
	console.log("server running on http://localhost:3000");
});