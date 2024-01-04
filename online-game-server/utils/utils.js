function getInitialGameData(lobbyJson) {
    let data = {
        mapSizeX: lobbyJson.mapSizeX,
        mapSizeY: lobbyJson.mapSizeY,
        squareSize: lobbyJson.squareSize,
        players: {},
        structures: {},
        units: {}
    };

    console.log("configuring game start for lobby ");
    console.log(lobbyJson);
    console.log("with players ");
    console.log(lobbyJson.players);

    console.log(Object.keys(lobbyJson.players));

    const playerIds = Object.keys(lobbyJson.players);
    const numPlayers = playerIds.length;
    const quarterMapWidth = Math.floor(lobbyJson.mapSizeX / 4);

    for (let i = 0; i < numPlayers; i++) {
        const playerId = playerIds[i];
        console.log("adding player " + playerId + " to game");
        console.log(playerId);
        console.log(lobbyJson.players[playerId]);
        const playerX = Math.floor(Math.random() * (lobbyJson.mapSizeX - quarterMapWidth * 2)) + quarterMapWidth;
        const playerY = Math.floor(Math.random() * lobbyJson.mapSizeY);
        data.players[playerId] = {
            x: playerX,
            y: playerY,
            color: lobbyJson.players[playerId].color,
            username: lobbyJson.players[playerId].username,
            hoverRadius: lobbyJson.players[playerId].hoverRadius,
            keys: [],
            mouse: [],
            mouseButtons: [],
            building: false,
            buildingIndex: 0,
        };

        const structureX = Math.floor(Math.random() * (lobbyJson.mapSizeX - quarterMapWidth * 2)) + quarterMapWidth;
        const structureY = Math.floor(Math.random() * lobbyJson.mapSizeY);
        const structureId = playerId + "_base";
        data.structures[structureId] = {
            player: playerId,
            position: { x: structureX, y: structureY },
            health: 100,
            type: "base",
        };
    }

    return data;
}

function generateLobbyName() {
    const adjectives = [
        "flappy",
        "red",
        "green",
        "blue",
        "yellow",
        "fast",
        "slow",
        "happy",
        "sad",
        "jumping",
        "running",
        "sleepy",
        "quiet",
        "loud",
        "bright",
        "dark",
        "tiny",
        "huge",
        "slimy",
        "dry",
        "wet",
        "furry",
        "smooth",
        "rough",
        "tall",
        "short",
        "round",
        "square",
        "spiky",
        "curly"
    ];
    const colors = [
        "aqua",
        "black",
        "blue",
        "fuchsia",
        "gray",
        "green",
        "lime",
        "maroon",
        "navy",
        "olive",
        "orange",
        "purple",
        "red",
        "silver",
        "teal",
        "white",
        "yellow",
        "azure",
        "ivory",
        "teal",
        "silver",
        "raspberry",
        "canary",
        "rosey",
        "plum",
        "sepia",
        "amethyst",
        "pearl",
        "scarlet",
        "bronze"
    ];
    const nouns = [
        "goblin",
        "elephant",
        "cat",
        "dog",
        "bird",
        "fish",
        "mouse",
        "horse",
        "monkey",
        "lion",
        "tiger",
        "bear",
        "frog",
        "duck",
        "turtle",
        "rabbit",
        "squirrel",
        "owl",
        "beaver",
        "bison",
        "butterfly",
        "chameleon",
        "dolphin",
        "eagle",
        "flamingo",
        "gecko",
        "hippo",
        "iguana",
        "jellyfish",
        "kangaroo"
    ];

    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}-${color}-${noun}`;
}

function updateGame(gameJsonCurrent) {
    //console.log("updating game");
    //console.log(gameJsonCurrent);

    // randomly with a 0.1% chance, spawn a rock at a random edge of the map moving in a random direction
    if (Math.random() < 0.01) {
        let health = Math.random() * 100;
        let rock = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            color: "yellow",
            type: "rock",
            id: Math.random(),
            health: health,
            originalHealth: health,
            alive: true
        };

        let side = Math.floor(Math.random() * 4);
        if (side == 0) {
            rock.x = 0;
            rock.y = Math.floor(Math.random() * gameJsonCurrent.mapSizeY);
            rock.dx = 0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
            rock.dy = -0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
        } else if (side == 1) {
            rock.x = gameJsonCurrent.mapSizeX;
            rock.y = Math.floor(Math.random() * gameJsonCurrent.mapSizeY);
            rock.dx = -0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
            rock.dy = 0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
        } else if (side == 2) {
            rock.x = Math.floor(Math.random() * gameJsonCurrent.mapSizeX);
            rock.y = 0;
            rock.dx = 0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
            rock.dy = 0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
        } else if (side == 3) {
            rock.x = Math.floor(Math.random() * gameJsonCurrent.mapSizeX);
            rock.y = gameJsonCurrent.mapSizeY;
            rock.dx = -0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
            rock.dy = -0.01 * (1 + Math.random() * 0.2); // Randomize speed with a factor of 2
        }

        // if the game has no rocks yet, initialize the rocks object
        if (!gameJsonCurrent.rocks) {
            gameJsonCurrent.rocks = {};
        }

        gameJsonCurrent.rocks[rock.id] = rock;
    }

    // update rock positions
    if (gameJsonCurrent.rocks) {
        //console.log("updating rocks");
        //console.log(gameJsonCurrent.rocks);
        for (let rockId in Object.keys(gameJsonCurrent.rocks)) {
            rockId = Object.keys(gameJsonCurrent.rocks)[rockId];
            let rock = gameJsonCurrent.rocks[rockId];
            //console.log("updating rock " + rockId);
            rock.x += rock.dx;
            rock.y += rock.dy;

            // check if player is hovering over the rock
            for (let playerId in Object.keys(gameJsonCurrent.players)) {
                playerId = Object.keys(gameJsonCurrent.players)[playerId];
                let player = gameJsonCurrent.players[playerId];

                // calculate distance between player and rock
                let distance = Math.sqrt(Math.pow(player.x - rock.x, 2) + Math.pow(player.y - rock.y, 2));

                // if player is hovering over the rock, decrease rock health and update player points
                if (distance <= player.hoverRadius) {
                    //console.log("player " + playerId + " is hovering over rock " + rockId);
                    rock.health -= 1;
                    if (rock.health <= 0) {
                        //console.log("rock " + rockId + " has died");
                        rock.alive = false;

                        // if player points are not initialized, initialize them
                        if (!player.points) {
                            player.points = 200;
                        }
                        player.points += rock.originalHealth;
                    }
                }
            }

        }

        // any of the rocks that are off the map, set alive=false
        for (let rockId of Object.keys(gameJsonCurrent.rocks)) {
            try {
                let rock = gameJsonCurrent.rocks[rockId];
                if (
                    rock.x < 0 ||
                    rock.x > gameJsonCurrent.mapSizeX ||
                    rock.y < 0 ||
                    rock.y > gameJsonCurrent.mapSizeY
                ) {
                    rock.alive = false;
                }
            } catch (error) {
                console.log(error);
            }
        }


        // remove all rocks with alive=false
        let rocksToDelete = [];

        for (let rockId of Object.keys(gameJsonCurrent.rocks)) {
            let rock = gameJsonCurrent.rocks[rockId];
            if (!rock || !rock.alive) {
                rocksToDelete.push(rockId);
            }
        }

        for (let rockId of rocksToDelete) {
            delete gameJsonCurrent.rocks[rockId];
        }
    }

    // if any of the structures have factory in the type, add 1 to their charge or 
    // if the charge is full, spawn a unit
    for (let structureId of Object.keys(gameJsonCurrent.structures)) {
        let structure = gameJsonCurrent.structures[structureId];
        if (structure.type.includes("factory")) {
            if (!structure.charge) {
                structure.charge = 0;
            }
            structure.charge += 1;
            if (structure.charge >= structure.maxCharge) {
                structure.charge = 0;
                let unitId = Math.random().toString(36).substr(2, 10);

                // get the position of the controlling player's base and set the initial position there
                let playerId = structure.player
                let playerBase = gameJsonCurrent.structures[playerId + "_base"];
                let initialPosition = playerBase.position;
                let unit = {
                    position: {
                        x: initialPosition.x,
                        y: initialPosition.y,
                    },
                    path: [],
                    color: "white",
                    type: structure.unitType,
                    id: unitId,
                    health: 100,
                    originalHealth: 100,
                    alive: true,
                    player: structure.player,
                };
                gameJsonCurrent.units[unitId] = unit;
            }
        }
    }

    return gameJsonCurrent;
}

module.exports = { updateGame, getInitialGameData, generateLobbyName };