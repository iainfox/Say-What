import type { Server, Socket } from "socket.io";
import LobbyManager from "../types/LobbyManager.js";

function getPlayerContext(socketId: string) {
    const lobbyCode = LobbyManager.getLobbyFromPlayer(socketId);
    if (!lobbyCode) return null;

    const lobby = LobbyManager.getLobby(lobbyCode);
    if (!lobby) return null;

    const player = lobby.players.find((p) => p.socketId === socketId);
    if (!player) return null;

    return { lobbyCode, lobby, player };
}

function generateLobbyCode(): string {
    let code: string;

    do {
        code = Math.random().toString(36).substring(2, 6).toUpperCase();
    } while (LobbyManager.getLobby(code));

    return code;
}

export function leaveCurrentLobby(io: Server, socket: Socket) {
    const code = LobbyManager.getLobbyFromPlayer(socket.id);
    if (!code) return;

    LobbyManager.removePlayer(socket.id);
    socket.leave(code);
    io.to(code).emit("playerLeft", socket.id);
}

export function changeUsername(socket: Socket, username: string) {
    const context = getPlayerContext(socket.id);
    if (!context) return;

    const { lobby, player } = context;

    player.name = username;

    if (lobby.host.socketId === socket.id) {
        lobby.host.name = username;
    }

    socket.emit("usernameChanged", username);
}

export function createLobby(io: Server, socket: Socket) {
    leaveCurrentLobby(io, socket);

    const code = generateLobbyCode();

    LobbyManager.createLobby(code, socket.id);

    socket.join(code);
    socket.emit("lobbyCreated", code);
}

export function joinLobby(io: Server, socket: Socket, code: string) {
    leaveCurrentLobby(io, socket);

    const lobby = LobbyManager.getLobby(code);
    if (!lobby) return;

    LobbyManager.addPlayer(code, socket.id)

    socket.join(code);

    io.to(code).emit("playerJoined", socket.id);
}

export function isValidLobby(socket: Socket, code: string) {
    socket.emit("isValidLobby", !!LobbyManager.getLobby(code));
}