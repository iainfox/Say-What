import Lobby from "./Lobby.js";
import Player from "./Player.js";

class LobbyManager {
	private lobbies: Map<string, Lobby> = new Map();
	private playerLobbyMap: Map<string, string> = new Map();

	createLobby(code: string, origin: string) {
		const host = new Player(origin);

		const lobby = new Lobby(code, host);
		this.lobbies.set(code, lobby);
		this.playerLobbyMap.set(host.socketId, code)
		
		return lobby;
	}

	getLobby(code: string) {
		return this.lobbies.get(code);
	}
	
	getLobbyFromPlayer(socketId: string) {
		return this.playerLobbyMap.get(socketId);
	}

	removePlayer(socketId: string) {
		const code = this.playerLobbyMap.get(socketId);
		if (!code) return;

		const lobby = this.lobbies.get(code);
		if (!lobby) return;

		lobby.players = lobby.players.filter(
			(p) => p.socketId !== socketId
		);

		this.playerLobbyMap.delete(socketId);

		if (lobby.host.socketId === socketId) {
			const newHost = lobby.players[0];
			if (newHost) {
				lobby.host = newHost;
			}
		}

		if (lobby.players.length === 0) {
			this.lobbies.delete(code);
		}

		return code;
	}

	removeLobby(code: string) {
		this.lobbies.delete(code);
	}

	addPlayer(code: string, origin: string) {
		const player = new Player(origin);

		const lobby = this.lobbies.get(code);
		if (!lobby) return;

		lobby.players.push(player);
		this.playerLobbyMap.set(player.socketId, code);
	}
}

export default new LobbyManager();
