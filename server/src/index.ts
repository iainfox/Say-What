import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import Player from "./types/Player.js";
import type {
    ServerToClientEvents,
    ClientToServerEvents,
} from "../../shared/events.js";
import {
	changeUsername,
	createLobby,
	disconnect,
	isValidLobby,
	joinLobby
} from "./handlers/LobbyHandler.js";

const app = express();
const server = createServer(app);
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents
>(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("createLobby", () => createLobby(io, socket));
	socket.on("disconnect", () => disconnect(io, socket));

	socket.on("joinLobby", (code: string) => joinLobby(io, socket, code));
	socket.on("isValidLobby", (code: string) => isValidLobby(socket, code));

	socket.on("changeUsername", (username: string) => changeUsername(socket, username));
	socket.on("randomizeUsername", () => changeUsername(socket, Player.generateUsername()))
});

server.listen(3000, () => {
	console.log("server running on http://localhost:3000");
});