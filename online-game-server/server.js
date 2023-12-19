function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}

function updatePlayer(player) {
    // set the acceleration
    player.state.acceleration.x = 0;
    player.state.acceleration.y = 0.1;

    for (key in player.state.keys) {
        key = player.state.keys[key];

        if (key == 'a') {
            player.state.velocity.x += -0.1;
        }
        if (key == 'd') {
            player.state.velocity.x += 0.1;
        }
        if (key == 'w') {
            player.state.velocity.y += -0.1;
        }
        if (key == 's') {
            player.state.velocity.y += 0.1;
        }
    }

    // physics
    player.state.velocity.x += player.state.acceleration.x;
    player.state.velocity.y += player.state.acceleration.y;

    player.state.position.x += player.state.velocity.x;
    player.state.position.y += player.state.velocity.y;

    //if the player goes out of bounds, reflect them off the wall they collided with
    if (player.state.position.x < -30 || player.state.position.x > 60) {
        player.state.position.x = Math.max(-30, Math.min(60, player.state.position.x)); // clamp the position
        player.state.velocity.x *= -1; // reflect the velocity
    }
    if (player.state.position.y < 0 || player.state.position.y > 30) {
        player.state.position.y = Math.max(0, Math.min(30, player.state.position.y)); // clamp the position
        player.state.velocity.y *= -1; // reflect the velocity
    }

    //player.state.velocity.x *= 0.999; // friction
    //player.state.velocity.y *= 0.999; // friction

    // if the distance to the other players is less than 10, reflect the velocity
    Object.keys(gameData.players).forEach((playerId) => {
        if (playerId != player.id) {
            console.log('playerId: ', playerId);
            console.log('player.id: ', player.id);
            let otherPlayer = gameData.players[playerId];
            let dx = player.state.position.x - otherPlayer.state.position.x;
            let dy = player.state.position.y - otherPlayer.state.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 10 && distance > 0) {
                // Calculate the contact point
                // Remove unused variables
                // let contactPointX = (player.state.position.x + otherPlayer.state.position.x) / 2;
                // let contactPointY = (player.state.position.y + otherPlayer.state.position.y) / 2;

                // Calculate the normal vector of the contact point
                let normalX = (player.state.position.x - otherPlayer.state.position.x) / distance;
                let normalY = (player.state.position.y - otherPlayer.state.position.y) / distance;

                // Calculate the dot product of velocity and normal vector
                let dotProduct = player.state.velocity.x * normalX + player.state.velocity.y * normalY;

                // Calculate the reflection vector
                let reflectionX = player.state.velocity.x - 2 * dotProduct * normalX;
                let reflectionY = player.state.velocity.y - 2 * dotProduct * normalY;

                // Update the player's velocity with the reflection vector
                player.state.velocity.x = reflectionX;
                player.state.velocity.y = reflectionY;

                player.state.position.x += player.state.velocity.x;
                player.state.position.y += player.state.velocity.y;
            }
        }
    });

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
                x: getRandomPosition(-30, 60),
                y: getRandomPosition(0, 30),
            },
            velocity: {
                x: 0,
                y: 0,
            },
            acceleration: {
                x: 0,
                y: 0,
            },
            keys: [],
            colour: "#000000",
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
                        x: getRandomPosition(-30, 60),
                        y: getRandomPosition(0, 30),
                    },
                    velocity: {
                        x: 0,
                        y: 0,
                    },
                    acceleration: {
                        x: 0,
                        y: 0,
                    },
                    keys: [],
                    colour: "#000000",
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

    socket.on('join', (playerData) => {
        console.log('user joined');
        console.log('playerData: ', playerData);
        if (!(socket.id in gameData.players)) {
            // Add the player to the game data
            gameData.players[socket.id] = {
                lastHeartbeat: Date.now(),
                state: {
                    position: {
                        x: getRandomPosition(-30, 60),
                        y: getRandomPosition(0, 30),
                    },
                    velocity: {
                        x: 0,
                        y: 0,
                    },
                    acceleration: {
                        x: 0,
                        y: 0,
                    },
                    keys: [],
                    colour: "#000000",
                },
            };
        }
        gameData.players[socket.id].state.colour = playerData["colour"];
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