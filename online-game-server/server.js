const { getInitialGameData, generateLobbyName } = require('./utils/utils.js');

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
let lobbyJsons = {};


io.on('connection', (socket) => {
    console.log('a user connected:', socket.handshake.headers.referer);

    // When a player connects, add them to the game data
    gameData.players[socket.id] = {
        lastHeartbeat: Date.now(),
        state: {
            keys: [],
            colour: "#000000",
        },
    };

    // use heartbeat to check if clients are still connected
    socket.on('heartbeat', () => {
        //console.log('heartbeat from: ', socket.id);

        if (!(socket.id in gameData.players)) {
            // Add the player to the game data
        }

        // Update the last heartbeat time for the player
        gameData.players[socket.id].lastHeartbeat = Date.now();
    });

    socket.on('keys', (keys) => {
        //console.log('keys: ', keys, ' from: ', socket.id);

        // update the player's state based on the keys
        if (socket.id in gameData.players) {
            gameData.players[socket.id].state.keys = keys;
        }
    });

    socket.on('join', (playerMeta) => {
        console.log('user joined');
        console.log('playerMeta: ', playerMeta);
        socket.join(playerMeta["lobbyCode"]);

        // add the player to the lobby in the lobbyJsons
        try {
            // if the player isnt already in the lobby add them
            if (!lobbyJsons[playerMeta["lobbyCode"]].players.map((playerMeta) => playerMeta.playerId).includes(playerMeta.playerId)) {
                lobbyJsons[playerMeta["lobbyCode"]].players.push(playerMeta);
                console.log('added player to lobby: ', playerMeta["lobbyCode"]);
            } else {
                console.log('player already in lobby: ', playerMeta["lobbyCode"]);
            }

            io.to(playerMeta["lobbyCode"]).emit('lobbyData', { lobbyState: lobbyJsons[playerMeta["lobbyCode"]] });
            io.to(playerMeta["lobbyCode"]).emit('join', { status: "complete", lobbyState: lobbyJsons[playerMeta["lobbyCode"]] });
        } catch {
            console.log("failed to add player to lobby");
        }
    });
});


setInterval(() => {
    // Update the game time
    gameData.time++;

    // console log the player id list
    //console.log('player id list: ', Object.keys(gameData.players));

    // update all players based on their states
    Object.keys(gameData.players).forEach((playerId) => {
        gameData.players[playerId] = updatePlayer(gameData.players[playerId]);
    });

    // all players whose last heartbeat was more than 5 seconds ago are disconnected
    Object.keys(gameData.players).forEach((playerId) => {
        if (Date.now() - gameData.players[playerId].lastHeartbeat > 1000) {
            delete gameData.players[playerId];
            //console.log('deleted player: ', playerId);
            io.emit('playerDisconnected', playerId);
        }
    });

    // Emit the updated game data to all connected clients
    io.emit('gameData', gameData);

    //console.log('gameData: ', gameData);
    //console.log('just emitted gameData with player count: ', Object.keys(gameData.players).length);
}, 20);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/create-lobby', (req, res) => {
    // create a new lobby
    // add the lobby to the lobby list
    // return the lobby code
    const lobbyCode = generateLobbyName();

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
            players: [],
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

app.get('/example', (req, res) => {
    res.json({
        exampleText: 'Hello, World!',
    });
});

server.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}/`);
});