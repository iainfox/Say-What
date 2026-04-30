export interface ServerToClientEvents {
    lobbyCreated: (code: string) => void;
    playerLeft: (socketId: string) => void;
    usernameChanged: (username: string) => void;
    isValidLobby: (isValid: boolean) => void;
}

export interface ClientToServerEvents {
    createLobby: () => void;
    disconnect: () => void;
    joinLobby: (code: string) => void;
    isValidLobby: (code: string) => void;

    changeUsername: (username: string) => void;
    randomizeUsername: () => void;
}
