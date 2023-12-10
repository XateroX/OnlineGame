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

io.on('connection', (socket) => {
    console.log('a user connected:', socket.handshake.headers.referer);
    socket.on('disconnect', () => {
        console.log("user disconnected");
    });
});

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