const { getInitialGameData, generateLobbyName } = require('./utils/utils.js');
const { togglePlayerInLobbyReadyState } = require('./utils/lobbyUtils.js');

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
require('dotenv').config();

const router = express.Router();
const cors = require('cors');

const corsOptions = {
    origin: (origin, callback) => {
        console.log("cors checking, origin: ", origin);
        if (origin.startsWith(process.env.CLIENT_BASE_URL)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIO(server, { cors: corsOptions });


function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}

function updatePlayer(player) {
    return player;
}


let gameData = getInitialGameData();

let serverTime = 0;

// json of all the lobbies and their data
let lobbyJsons = {};

// json of all the players and their data
let playerJsons = {};


io.on('connection', (socket) => {
    console.log('a user connected:', socket.handshake.headers.referer);

    // save that player
    playerJsons[socket.id] = {
        playerId: null, // this should ultimately be the socket.id but thats a change for another time
        socket: socket,
        lobbyCode: null,
        lastHeartbeat: Date.now(),
        ready: false,
    };

    // use heartbeat to check if clients are still connected
    socket.on('heartbeat', () => {
        //console.log('heartbeat from: ', socket.id);

        if (!(socket.id in playerJsons)) {
            // Add the player to the game data
            playerJsons[socket.id] = {
                playerId: null, // this should ultimately be the socket.id but thats a change for another time
                socket: socket,
                lobbyCode: null,
                lastHeartbeat: Date.now(),
                ready: false,
            };
        }

        // Update the last heartbeat time for the player
        playerJsons[socket.id].lastHeartbeat = Date.now();
    });

    socket.on('keys', (keys) => {
        //console.log('keys: ', keys, ' from: ', socket.id);

        // update the player's state based on the keys
        if (socket.id in playerJsons) {
        }
    });

    socket.on('join', (playerMeta) => {
        console.log('user joined');
        console.log('playerMeta: ', playerMeta);
        socket.join(playerMeta["lobbyCode"]);

        // add the player to the lobby in the lobbyJsons
        try {
            // if the player isnt already in the lobby add them
            if (!Object.keys(lobbyJsons[playerMeta["lobbyCode"]].players).includes(playerMeta.playerId) && Object.keys(lobbyJsons[playerMeta["lobbyCode"]].players).length < lobbyJsons[playerMeta["lobbyCode"]].maxPlayers) {
                lobbyJsons[playerMeta["lobbyCode"]].players[playerMeta["playerId"]] = playerMeta;
                console.log('added player to lobby: ', playerMeta["lobbyCode"]);
                console.log('playerMeta["playerId"]: ', playerMeta["playerId"]);

                // save some info about the player
                playerJsons[socket.id].lobbyCode = playerMeta["lobbyCode"];
                playerJsons[socket.id].lastHeartbeat = Date.now();
                playerJsons[socket.id].playerId = playerMeta.playerId;

                io.to(playerMeta["lobbyCode"]).emit('lobbyData', { lobbyState: lobbyJsons[playerMeta["lobbyCode"]] });
                io.to(playerMeta["lobbyCode"]).emit('join', { status: "complete", lobbyState: lobbyJsons[playerMeta["lobbyCode"]] });
            } else {
                console.log('player already in lobby or lobby full: ', playerMeta["lobbyCode"]);
            }
        } catch {
            console.log("failed to add player to lobby");
        }
    });

    socket.on('toggleReady', (data) => {
        console.log('toggleReady: ', data);
        // toggle the player's ready state
        console.log('lobbyJsons[data["lobbyCode"]].players: ', lobbyJsons[data["lobbyCode"]].players)
        if (Object.keys(lobbyJsons[data["lobbyCode"]].players).includes(data.playerId)) {
            postToggleLobbyJson = togglePlayerInLobbyReadyState(lobbyJsons[data["lobbyCode"]], data.playerId)
            console.log('postToggleLobbyJson: ', postToggleLobbyJson);
            lobbyJsons[data["lobbyCode"]].players[data.playerId] = postToggleLobbyJson.players[data.playerId];
            console.log('lobbyJsons[data["lobbyCode"]].players post: ', lobbyJsons[data["lobbyCode"]].players)
            io.to(data.lobbyCode).emit('lobbyData', { lobbyState: lobbyJsons[data.lobbyCode] });
        }
    });
});


setInterval(() => {
    // Update the server time
    serverTime++;

    // all players whose last heartbeat was more than 5 seconds ago are disconnected
    Object.keys(playerJsons).forEach((ID) => {
        if (Date.now() - playerJsons[ID].lastHeartbeat > 1000) {
            delete playerJsons[ID];
            //console.log('deleted player: ', playerId);
            io.emit('playerDisconnected', ID);
        }
    });

    //console.log('gameData: ', gameData);
    console.log('player count: ', Object.keys(playerJsons).length);
}, 20);

app.post('/create-lobby', (req, res) => {
    // create a new lobby
    // add the lobby to the lobby list
    // return the lobby code
    let lobbyCode = generateLobbyName();

    // if somehow the lobby code is already in use, generate a new one
    while (lobbyCode in lobbyJsons) {
        lobbyCode = generateLobbyName();
    }

    try {
        lobbyJsons[lobbyCode] = {
            lobbyName: req.body.lobbyName,
            lobbyCode: lobbyCode,
            maxPlayers: req.body.maxPlayers,
            gameMode: req.body.gameMode,
            players: {},
        };
        res.json({
            lobbyCode: lobbyCode,
            status: 'success',
        });

        console.log('created lobby: ', lobbyCode);
    } catch (err) {
        res.json({
            status: 'failed',
            error: err,
        });

        console.log('failed to create lobby: ', lobbyCode, ' with error: ', err);
    }

});

app.post('/lobby-exists', (req, res) => {
    // check if the lobby exists
    // return the lobby code
    const lobbyCode = req.body.lobbyCode;
    if (lobbyCode in lobbyJsons) {
        res.json({
            lobbyCode: lobbyCode,
            status: 'success',
        });
    } else {
        res.json({
            status: 'failed',
            lobbyJsons: lobbyJsons,
        });
    }
});

app.post('/join-lobby', (req, res) => {
    // check if the lobby exists
    // return the lobby code
    const lobbyCode = req.body.lobbyCode;
    if (lobbyCode in lobbyJsons && Object.keys(lobbyJsons[lobbyCode].players).length < lobbyJsons[lobbyCode].maxPlayers) {
        res.json({
            lobbyCode: lobbyCode,
            status: 'success',
        });
    } else {
        res.json({
            status: 'failed',
            lobbyJsons: lobbyJsons,
        });
    }
});

app.get('/example', (req, res) => {
    res.json({
        exampleText: 'Hello, World!',
    });
});

server.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}/`);
});