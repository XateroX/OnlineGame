import React, { useState, useEffect, useMemo } from 'react';
import Api from '../../api.js'
import { io } from 'socket.io-client'

const LobbyScreen = () => {
    const apiClient = useMemo(() => new Api(), [])

    const [lobbyCode, setLobbyCode] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username'));

    const serverurl = `${import.meta.env.VITE_SERVER_URL}`
    useEffect(() => {
        const socket = io(serverurl)
    }, []);


    const [failureJoiningLobby, setFailureJoiningLobby] = useState(false); // Added failureCreatingLobby state

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
            setFailureJoiningLobby(true);
            return;
        } else {
            window.location.href = '/lobbywaitingroom/' + lobbyCode + '/';
        }


    };

    const dismissFailurePopup = () => {
        setFailureJoiningLobby(false);
        setWaiting(false);
    };

    return (
        <div>
            {failureJoiningLobby && ( // Added failureCreatingLobby check
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div className="popup">
                        <h2>Failure Joining Lobby</h2>
                        <p>There was a failure joining a lobby with that code. Please try again.</p>
                        <button onClick={dismissFailurePopup}>Dismiss</button>
                    </div>
                </div>
            )}
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
