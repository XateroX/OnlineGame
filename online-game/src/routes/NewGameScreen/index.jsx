import React, { useState, useMemo, useEffect } from 'react';

import Api from '../../api.js'

import { useParams } from 'react-router-dom';
import './style.css'

const NewGameScreen = () => {
    const apiClient = useMemo(() => new Api(), [])

    const [lobbyName, setLobbyName] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [gameMode, setGameMode] = useState('classic');
    const [username, setUsername] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [failureCreatingLobby, setFailureCreatingLobby] = useState(false); // Added failureCreatingLobby state
    const [mapSizeX, setMapSizeX] = useState(10); // Added mapSizeX state
    const [mapSizeY, setMapSizeY] = useState(10); // Added mapSizeY state

    useEffect(() => {
        const cachedUsername = localStorage.getItem('username');
        if (cachedUsername) {
            setUsername(cachedUsername);
        }
    }, []);

    const handleCreateLobby = async () => {
        // Logic for creating a new lobby with the provided settings

        // make call to server to create lobby with lobbyCode, lobbyName, maxPlayers, gameMode, mapSizeX, mapSizeY
        // and set state of 'waiting' to true
        setWaiting(true);
        let res = await apiClient.createLobby(lobbyName, maxPlayers, gameMode, mapSizeX, mapSizeY)
        console.log('res');
        console.log(res);

        if (res.data.status != 'success' || res.status != 200) {
            setWaiting(false);
            setFailureCreatingLobby(true);
            console.log('Failure creating lobby');
            return;
        } else {
            const lobbyCode = res.data.lobbyCode;
            res = await apiClient.joinLobby(lobbyCode)
            console.log('res');
            console.log(res);
            if (res.data.status != 'success' || res.status != 200) {
                setWaiting(false);
                setFailureCreatingLobby(true);
                console.log('Failure joining lobby');
                return;
            } else {
                window.location.href = '/lobbywaitingroom/' + lobbyCode + '/';
            }
        }
    };

    const dismissFailurePopup = () => {
        setFailureCreatingLobby(false);
        setWaiting(false);
    };

    const handleUsernameChange = (e) => {
        const username = e.target.value;
        setUsername(username);
        localStorage.setItem('username', username);
    };

    return (
        <div>
            {waiting && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div className="spinner">
                        <div className="double-bounce1"></div>
                        <div className="double-bounce2"></div>
                    </div>
                </div>
            )}
            {failureCreatingLobby && ( // Added failureCreatingLobby check
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div className="popup">
                        <h2>Failure Creating Lobby</h2>
                        <p>There was a failure creating the lobby. Please try again.</p>
                        <button onClick={dismissFailurePopup}>Dismiss</button>
                    </div>
                </div>
            )}
            <h1>Create New Lobby</h1>
            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                />
            </label>
            <br />
            <label>
                Lobby Name:
                <input
                    type="text"
                    value={lobbyName}
                    onChange={(e) => setLobbyName(e.target.value)}
                />
            </label>
            <br />
            <label>
                Max Players:
                <input
                    type="number"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                />
            </label>
            <br />
            <label>
                Game Mode:
                <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                    <option value="classic">Classic</option>
                    <option value="team">Team</option>
                    <option value="free-for-all">Free for All</option>
                </select>
            </label>
            <br />
            <label>
                Map Size X: {/* Added Map Size X field */}
                <input
                    type="number"
                    value={mapSizeX}
                    onChange={(e) => setMapSizeX(parseInt(e.target.value))}
                />
            </label>
            <br />
            <label>
                Map Size Y: {/* Added Map Size Y field */}
                <input
                    type="number"
                    value={mapSizeY}
                    onChange={(e) => setMapSizeY(parseInt(e.target.value))}
                />
            </label>
            <br />
            <button onClick={handleCreateLobby}>Create Lobby</button>
        </div>
    );
};

export default NewGameScreen;
