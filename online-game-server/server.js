function updatePlayer(player) {
    for (key in player.state.keys) {
        key = player.state.keys[key];
        if (key == 'a') {
            player.state.position.x -= 1;
        }
        if (key == 'd') {
            player.state.position.x += 1;
        }
        if (key == 'w') {
            player.state.position.y -= 1;
        }
        if (key == 's') {
            player.state.position.y += 1;
        }
    }
    return player;
}

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
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIO(server, { cors: corsOptions });

let gameData = {
    time: 0,
    players: {},
    // other game data...
};

io.on('connection', (socket) => {
    console.log('a user connected:', socket.handshake.headers.referer);

    // When a player connects, add them to the game data
    gameData.players[socket.id] = {
        lastHeartbeat: Date.now(),
        state: {
            position: {
                x: 0,
                y: 0,
            },
            keys: [],
        },
    };

    // use heartbeat to check if clients are still connected
    socket.on('heartbeat', () => {
        console.log('heartbeat from: ', socket.id);

        if (!(socket.id in gameData.players)) {
            // Add the player to the game data
            gameData.players[socket.id] = {
                lastHeartbeat: Date.now(),
                state: {
                    position: {
                        x: 0,
                        y: 0,
                    },
                    keys: [],
                },
            };
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
});

setInterval(() => {
    // Update the game time
    gameData.time++;

    // console log the player id list
    console.log('player id list: ', Object.keys(gameData.players));

    // update all players based on their states
    Object.keys(gameData.players).forEach((playerId) => {
        gameData.players[playerId] = updatePlayer(gameData.players[playerId]);
    });

    // all players whose last heartbeat was more than 5 seconds ago are disconnected
    Object.keys(gameData.players).forEach((playerId) => {
        if (Date.now() - gameData.players[playerId].lastHeartbeat > 1000) {
            delete gameData.players[playerId];
            console.log('deleted player: ', playerId);
            io.emit('playerDisconnected', playerId);
        }
    });

    // Emit the updated game data to all connected clients
    io.emit('gameData', gameData);

    console.log('gameData: ', gameData);
    console.log('just emitted gameData with player count: ', Object.keys(gameData.players).length);
}, 20);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/example', (req, res) => {
    res.json({
        exampleText: 'Hello, World!',
    });
});

server.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}/`);
});