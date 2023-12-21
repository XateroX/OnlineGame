import axios from 'axios';

export default class Api {
    constructor(credential) {
        this.apiUrl = import.meta.env.VITE_SERVER_URL;
        console.log("apiUrl: ", this.apiUrl);
        this.credential = credential;
        let headers = {
            Accept: 'application/json',
        };
        if (this.credential) {
            headers.Authorization = `Bearer ${this.credential}`;
        }
        this.client = axios.create({
            baseURL: this.apiUrl,
            timeout: 31000,
            headers: headers,
        });
    };

    // example get request
    getExample = () => {
        return this.client.get('/example');
    };

    createLobby = (lobbyName, maxPlayers, gameMode) => {
        const data = {
            lobbyName: lobbyName,
            maxPlayers: maxPlayers,
            gameMode: gameMode,
        };
        console.log('data');
        console.log(data);
        return this.client.post('/create-lobby', data);
    }

    findLobby = (lobbyCode) => {
        let data = {
            lobbyCode: lobbyCode,
        };
        return this.client.post(`/lobby-exists`, data);
    }

    joinLobby = (lobbyCode) => {
        let data = {
            lobbyCode: lobbyCode
        };
        return this.client.post(`/join-lobby`, data);
    }
}