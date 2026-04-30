import type { Server, Socket } from "socket.io";
import LobbyManager from "../types/LobbyManager.js";

function leaveCurrentLobby(io: Server, socket: Socket) {
    const code = LobbyManager.getLobbyFromPlayer(socket.id);
    if (!code) return;

    LobbyManager.removePlayer(socket.id);
    socket.leave(code);
    io.to(code).emit("playerLeft", socket.id);
}

export function changeUsername(socket: Socket, username: string) {
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

export function createLobby(io: Server, socket: Socket) {
    leaveCurrentLobby(io, socket);

    let code = Math.random().toString(36).substring(2, 6).toUpperCase();
    while (LobbyManager.getLobby(code) !== undefined) {
        code = Math.random().toString(36).substring(2, 6).toUpperCase();
    }

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
    if (LobbyManager.getLobby(code)) {
        socket.emit("isValidLobby", true);
    } else {
        socket.emit("isValidLobby", false);
    }
}

export function disconnect(io: Server, socket: Socket) {
    leaveCurrentLobby(io, socket);
}