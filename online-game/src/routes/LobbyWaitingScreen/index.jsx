import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client'

const LobbyWaitingScreen = () => {
    const { id } = useParams();

    const [lobbyState, setLobbyState] = useState({ players: [] });

    // generate a player id using 9 random letter and numbers
    const playerId = sessionStorage.getItem('playerId') || Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem('playerId', playerId);

    // get username from local storage
    const username = localStorage.getItem('username');
    const serverurl = `${import.meta.env.VITE_SERVER_URL}`
    const socket = io(serverurl)

    socket.on('lobbyUpdate', (data) => {
        const { lobbyState } = data;
        console.log('Received lobbyUpdate event');
        setLobbyState(lobbyState);
    });

    useEffect(() => {
        const joinLobby = () => {
            socket.emit('join', { playerId: playerId, lobbyCode: id, username: username });
            console.log('Sent join event');
        };

        const checkStatus = (status) => {
            if (status === 'complete') {
                console.log('Checked and status was complete');
            } else {
                joinLobby();
                console.log('Checked and status was not complete');
            }
        };

        socket.on('join', (data) => {
            console.log('Received join event');
            const { status, lobbyState } = data;
            setLobbyState(lobbyState);
            checkStatus(status);
        });

        joinLobby();

        return () => {
            socket.off('join');
        };
    }, [id]);

    return (
        <div>
            <h1>Game Lobby</h1>
            <h2>{id}</h2>
            <p>Waiting for the game to start...</p>
            <ul>
                {lobbyState.players.map((player) => (
                    <li key={player.playerId}>{player.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default LobbyWaitingScreen;
