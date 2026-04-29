import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

class Player {
    name: string;
    socketId: string;

    constructor(socketId: string) {
        const defaultName = uniqueNamesGenerator({
            dictionaries: [adjectives, animals],
            separator: '',
            style: 'capital'
        }) + Math.floor(Math.random() * 1000);;
        
        this.name = defaultName;
        this.socketId = socketId;
    }
}

export default Player;