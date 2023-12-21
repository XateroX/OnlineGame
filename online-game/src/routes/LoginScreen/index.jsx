import React, { useState, useEffect, useMemo } from 'react';
import Api from '../../api.js'
import { io } from 'socket.io-client'

const LobbyScreen = () => {
    const apiClient = useMemo(() => new Api(), [])

    const [lobbyCode, setLobbyCode] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username'));

    const serverurl = `${import.meta.env.VITE_SERVER_URL}`
    const socket = io(serverurl)

    const [failureCreatingLobby, setFailureCreatingLobby] = useState(false); // Added failureCreatingLobby state

    // generate a player id using 9 random letter and numbers
    const playerId = Math.random().toString(36).substring(2, 11);

    const handleInputChange = (e) => {
        setLobbyCode(e.target.value);
    };

    const handleUsernameChange = (e) => {
        const username = e.target.value;
        setUsername(username);
        localStorage.setItem('username', username);
    };

    const handleLogin = async () => {
        // Add your logic for handling the login here
        console.log('Logging in with lobbyCode:', lobbyCode);
        console.log('Username:', username);

        // make call to server to see if a lobby with lobbyCode exists
        // if it does, join the lobby
        // if it doesn't, show an error message
        const res = await apiClient.findLobby(lobbyCode)

        console.log('res');
        console.log(res);

        if (res.data.status != 'success' || res.status != 200) {
            setFailureCreatingLobby(true);
            return;
        }

        window.location.href = '/lobbywaitingroom/' + lobbyCode + '/';
    };

    return (
        <div>
            <h1>Find Lobby with id...</h1>
            <label>
                Lobby Code:
                <input type="text" value={lobbyCode} onChange={handleInputChange} />
            </label>
            <br />

            <label>
                Username:
                <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <br />

            <button onClick={handleLogin}>Find</button>
        </div>
    );
};

export default LobbyScreen;
