import React, { useEffect, useState, useRef } from 'react';
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

    // Create a ref for the socket
    const socketRef = useRef();

    useEffect(() => {
        // Initialize the socket
        socketRef.current = io(serverurl);

        // Send a heartbeat 10 times per second
        const intervalId = setInterval(() => {
            socketRef.current.emit('heartbeat', {});
            console.log('heartbeat');
        }, 100);

        socketRef.current.on('join', (data) => {
            console.log('Received join event');
            const { status, lobbyState } = data;
            setLobbyState(lobbyState);
            checkStatus(status);
        });

        socketRef.current.on('lobbyData', (data) => {
            const { lobbyState } = data;
            console.log('Received lobbyData event');
            console.log(lobbyState);
            setLobbyState(lobbyState);
        });

        const joinLobby = () => {
            socketRef.current.emit('join', { playerId: playerId, lobbyCode: id, username: username, ready: false });
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

        joinLobby();
    }, []);

    const handleReadyToggle = () => {
        socketRef.current.emit('toggleReady', { playerId: playerId, lobbyCode: id });
    };

    return (
        <div>
            <h1>Game Lobby</h1>
            <h2>{id}</h2>
            <p>Waiting for the game to start...</p>
            {Object.keys(lobbyState.players).map((socketid) => (
                <div key={lobbyState.players[socketid].playerId}>
                    <span style={{ color: lobbyState.players[socketid].ready ? 'green' : 'red' }}>●</span>
                    {lobbyState.players[socketid].username}
                </div>
            ))}
            <button onClick={handleReadyToggle}>Ready</button>
        </div>
    );
};

export default LobbyWaitingScreen;
