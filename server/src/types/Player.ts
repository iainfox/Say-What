import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

class Player {
    name: string;
    socketId: string;

    constructor(socketId: string) {
        this.name = Player.generateUsername();
        this.socketId = socketId;
    }

    public static generateUsername() {
        return uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: '',
            style: 'capital'
        }) + Math.floor(Math.random() * 1000);;
    }
}

export default Player;