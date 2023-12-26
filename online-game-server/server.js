const { updateGame, getInitialGameData, generateLobbyName } = require('./utils/utils.js');
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

function updatePlayer(gameJson, playerId) {
    let player = gameJson.players[playerId];

    // update the players position (x,y) to be the mouse position but calculating which 
    // square on the board the mouse is in using the mapSizeX and mapSizeY and squareSize
    player.x = Math.floor(player.mouse.x / gameJson.squareSize);
    player.y = Math.floor(player.mouse.y / gameJson.squareSize);

    // restrict the player to the map
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x > gameJson.mapSizeX - 1) {
        player.x = gameJson.mapSizeX - 1;
    }
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y > gameJson.mapSizeY - 1) {
        player.y = gameJson.mapSizeY - 1;
    }

    gameJson.players[playerId] = player;

    return gameJson;
}

let serverTime = 0;

// json of all the lobbies and their data
let lobbyJsons = {};

// json of all the games and their data
let gameJsons = {};

// json of all the players and their data
let playerJsons = {};


io.on('connection', (socket) => {
    console.log('a user connected:', socket.handshake.headers.referer);

    // use heartbeat to check if clients are still connected
    socket.on('heartbeat', (data) => {
        //console.log('heartbeat from: ', socket.id);
        let playerId = data.playerId;

        if (!(playerId in playerJsons)) {
            // Add the player to the game data
            playerJsons[playerId] = {
                playerId: playerId, // this should ultimately be the socket.id but thats a change for another time
                socket: socket,
                lobbyCode: null,
                lastHeartbeat: Date.now(),
                ready: false,
            };
        }

        // Update the last heartbeat time for the player
        playerJsons[playerId].lastHeartbeat = Date.now();
    });

    socket.on('inputs', (inputs) => {
        console.log('inputs: ', inputs, ' from: ', inputs.playerId);
        console.log('inputs.keys');
        console.log(inputs.keys);
        console.log('inputs.mouse');
        console.log(inputs.mouse);

        // update the player's state based on the keys
        if (inputs.playerId in playerJsons && gameJsons[playerJsons[inputs.playerId].lobbyCode]) {
            gameJsons[playerJsons[inputs.playerId].lobbyCode].players[inputs.playerId].keys = inputs.keys;
            gameJsons[playerJsons[inputs.playerId].lobbyCode].players[inputs.playerId].mouse = inputs.mouse;

            // update the player in the gameJsons
            gameJsons[playerJsons[inputs.playerId].lobbyCode] = updatePlayer(gameJsons[playerJsons[inputs.playerId].lobbyCode], inputs.playerId);
        }
    });

    socket.on('join', (playerMeta) => {
        console.log('user joined');
        console.log('playerMeta: ', playerMeta);
        socket.join(playerMeta["lobbyCode"]);

        // if the player is not already registered, register them
        if (!(playerMeta["playerId"] in playerJsons)) {
            // Add the player to the game data
            playerJsons[playerMeta["playerId"]] = {
                playerId: playerMeta["playerId"], // this should ultimately be the socket.id but thats a change for another time
                socket: socket,
                lobbyCode: null,
                lastHeartbeat: Date.now(),
                ready: false,
            };
        }

        // if playerMeta doesnt contain some values, add defaults
        if (!playerMeta["hoverRadius"]) {
            playerMeta["hoverRadius"] = 1;
        }


        // add the player to the lobby in the lobbyJsons
        try {
            // if the player isnt already in the lobby add them
            if (!Object.keys(lobbyJsons[playerMeta["lobbyCode"]].players).includes(playerMeta.playerId) && Object.keys(lobbyJsons[playerMeta["lobbyCode"]].players).length < lobbyJsons[playerMeta["lobbyCode"]].maxPlayers) {
                lobbyJsons[playerMeta["lobbyCode"]].players[playerMeta["playerId"]] = playerMeta;
                console.log('added player to lobby: ', playerMeta["lobbyCode"]);
                console.log('playerMeta["playerId"]: ', playerMeta["playerId"]);
                console.log('playerMeta: ', playerMeta);

                // save some info about the player
                playerJsons[playerMeta["playerId"]].lobbyCode = playerMeta["lobbyCode"];
                playerJsons[playerMeta["playerId"]].lastHeartbeat = Date.now();
                playerJsons[playerMeta["playerId"]].playerId = playerMeta.playerId;

                io.to(playerMeta["lobbyCode"]).emit('lobbyData', { lobbyState: lobbyJsons[playerMeta["lobbyCode"]] });
                io.to(playerMeta["lobbyCode"]).emit('join', { status: "complete", lobbyState: lobbyJsons[playerMeta["lobbyCode"]] });
            } else {
                console.log('player already in lobby or lobby full: ', playerMeta["lobbyCode"]);
            }
        } catch (err) {
            console.log("failed to add player to lobby: ", playerMeta["lobbyCode"], " with error: ", err);
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

            // if all the players in that lobby are ready, start the game
            if (Object.keys(lobbyJsons[data["lobbyCode"]].players).every((playerId) => lobbyJsons[data["lobbyCode"]].players[playerId].ready)) {
                console.log('all players ready, starting game');

                // create a new game
                gameJsons[data["lobbyCode"]] = getInitialGameData(lobbyJsons[data["lobbyCode"]]);
            }
        }
    });
});


setInterval(() => {
    // Update the server time
    serverTime++;
    // go through all games and iterate them and send a game update to all players in the game
    Object.keys(gameJsons).forEach((lobbyCode) => {
        //console.log('gameJsons[lobbyCode]: ', gameJsons[lobbyCode]);
        gameJsons[lobbyCode] = updateGame(gameJsons[lobbyCode]);
        io.to(lobbyCode).emit('gameJson', gameJsons[lobbyCode]);
        console.log('sent gameJson to lobby: ', lobbyCode);
    });

    // all players whose last heartbeat was more than 5 seconds ago are disconnected
    Object.keys(playerJsons).forEach((playerId) => {
        if (Date.now() - playerJsons[playerId].lastHeartbeat > 1000) {
            delete playerJsons[playerId];
            //console.log('deleted player: ', playerId);
            io.emit('playerDisconnected', playerId);
        }
    });

    //console.log('gameData: ', gameData);
    console.log('player count: ', Object.keys(playerJsons).length);
}, 20);

setInterval(() => {
    // all lobbies have all players who are no longer in playersJson removed
    Object.keys(lobbyJsons).forEach((lobbyCode) => {
        Object.keys(lobbyJsons[lobbyCode].players).forEach((playerId) => {
            if (!(playerId in playerJsons)) {
                delete lobbyJsons[lobbyCode].players[playerId];
                console.log('deleted player: ', playerId);
            }
        });
    });

    // all lobbyJsons that have no players are deleted
    Object.keys(lobbyJsons).forEach((lobbyCode) => {
        if (Object.keys(lobbyJsons[lobbyCode].players).length == 0) {
            delete lobbyJsons[lobbyCode];
            console.log('deleted lobby: ', lobbyCode);

            // also delete the game if it exists
            if (lobbyCode in gameJsons) {
                delete gameJsons[lobbyCode];
                console.log('deleted game: ', lobbyCode);
            }
        }
    });
}, 5000);

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
            mapSizeX: req.body.mapSizeX,
            mapSizeY: req.body.mapSizeY,
            squareSize: 40,
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