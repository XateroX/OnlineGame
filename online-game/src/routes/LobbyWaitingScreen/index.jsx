import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client'
import { SocketContext } from '../../SocketContext';


const LobbyWaitingScreen = () => {
    const { id } = useParams();

    const [lobbyState, setLobbyState] = useState({ players: [] });

    // generate a player id using 9 random letter and numbers
    const playerId = sessionStorage.getItem('playerId') || Math.random().toString(36).substring(2, 11);
    sessionStorage.setItem('playerId', playerId);

    // get username from local storage
    const username = localStorage.getItem('username');
    //const serverurl = `${import.meta.env.VITE_SERVER_URL}`

    // Create a ref for the socket
    const { socket, isConnected } = useContext(SocketContext);

    console.log('socket');
    console.log(socket);

    useEffect(() => {

        if (!isConnected) {
            console.log('socket not initialized');
            return;
        }

        // Initialize the socket
        //socket.current = io(serverurl);

        socket.on('join', (data) => {
            console.log('Received join event');
            const { status, lobbyState } = data;
            setLobbyState(lobbyState);
            checkStatus(status);
        });

        socket.on('lobbyData', (data) => {
            const { lobbyState } = data;
            console.log('Received lobbyData event');
            console.log(lobbyState);
            setLobbyState(lobbyState);

            // if all players in the lobby are ready=true then change url to gamescreen
            let allPlayersReady = true;
            Object.keys(lobbyState.players).forEach((playerId) => {
                if (!lobbyState.players[playerId].ready) {
                    allPlayersReady = false;
                }
            });
            if (allPlayersReady) {
                window.location.href = '/game/' + lobbyState.lobbyCode + '/';
            }
        });

        const joinLobby = () => {
            socket.emit('join', {
                playerId: playerId,
                lobbyCode: id,
                username: username,
                ready: false,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            });
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
    }, [isConnected]);

    const handleReadyToggle = () => {
        socket.emit('toggleReady', { playerId: playerId, lobbyCode: id });
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
