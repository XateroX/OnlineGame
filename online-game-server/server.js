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
        "lastHeartbeat": Date.now(),
    };

    // use heartbeat to check if clients are still connected
    socket.on('heartbeat', () => {
        console.log('heartbeat from: ', socket.id);
        gameData.players[socket.id]["lastHeartbeat"] = Date.now();
    });
});



setInterval(() => {
    // Update the game time
    gameData.time++;

    // Update other game data...

    // Emit the updated game data to all connected clients
    io.emit('gameData', gameData);
    console.log('just emitted gameData with player count: ', Object.keys(gameData.players).length);

    // console log the player id list
    console.log('player id list: ', Object.keys(gameData.players));

    // all players whose last heartbeat was more than 5 seconds ago are disconnected
    Object.keys(gameData.players).forEach((playerId) => {
        if (Date.now() - gameData.players[playerId].lastHeartbeat > 5000) {
            // disconnect the player
            try {
                io.sockets.connected[playerId].disconnect();
            } catch (error) {
                console.log('error: ', error);
            }

            delete gameData.players[playerId];
            console.log('deleted player: ', playerId);
            io.emit('playerDisconnected', playerId);

        }
    });
}, 1000);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/example', (req, res) => {
    res.json({
        "exampleText": "Hello, World!"
    });
});



server.listen(port, () => {
    console.log(`Socket.IO server running on port ${port}/`);
});