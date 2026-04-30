import Player from "./Player.js";

class Lobby {
    code: string;
    players: Player[];
    host: Player;

    constructor(code: string, host: Player) {
        this.code = code;
        this.host = host;
        this.players = [host];
    }
}

export default Lobby;