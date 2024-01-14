const { UNIT_TEMPLATES, STRUCTURE_LIST, find_path } = require('./gameUtils.js');

function getInitialGameData(lobbyJson) {
    let data = {
        mapSizeX: lobbyJson.mapSizeX,
        mapSizeY: lobbyJson.mapSizeY,
        squareSize: lobbyJson.squareSize,
        players: {},
        structures: {},
        units: {},
        reserve: {},
        projectiles: {},
        time: 0,
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

        // No auto home generation
        // const structureX = Math.floor(Math.random() * (lobbyJson.mapSizeX - quarterMapWidth * 2)) + quarterMapWidth;
        // const structureY = Math.floor(Math.random() * lobbyJson.mapSizeY);
        // const structureId = playerId + "_base";
        // data.structures[structureId] = {
        //     player: playerId,
        //     position: { x: structureX, y: structureY },
        //     health: 100,
        //     type: "base",
        //     alive: true,
        // };
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

function updateGame(gameJsonCurrent, serverTime) {
    //console.log("updating game");
    //console.log(gameJsonCurrent);

    squareSize = gameJsonCurrent.squareSize;

    gameJsonCurrent.time = serverTime;

    // randomly with a 0.1% chance, spawn a rock at a random edge of the map moving in a random direction
    if (Math.random() < 0.004) {
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

    // update the projectile positions
    if (gameJsonCurrent.projectiles) {     
        //console.log("updating projectiles (all)");
        for (let projectileId in Object.keys(gameJsonCurrent.projectiles)) {
            projectileId = Object.keys(gameJsonCurrent.projectiles)[projectileId];
            let projectile = gameJsonCurrent.projectiles[projectileId];
            projectile.position.x += projectile.dx;
            projectile.position.y += projectile.dy;
            //console.log("updating projectile " + projectileId);
            //console.log(projectile);
        }

        // if any projectiles are on top of a unit or structure, kill the projectile and reduce the health of the unit or structure by 1
        for (let projectileId of Object.keys(gameJsonCurrent.projectiles)) {
            let projectile = gameJsonCurrent.projectiles[projectileId];
            for (let unitId of Object.keys(gameJsonCurrent.units)) {
                let unit = gameJsonCurrent.units[unitId];
                if (projectile.player !== unit.player) {
                    let distance = Math.sqrt(Math.pow(unit.position.x - projectile.position.x, 2) + Math.pow(unit.position.y - projectile.position.y, 2));
                    if (distance <= 1) {
                        //console.log("projectile " + projectileId + " has hit unit " + unitId);
                        projectile.alive = false;
                        unit.health -= 1;
                        if (unit.health <= 0) {
                            unit.alive = false;
                        }
                        gameJsonCurrent.units[unitId] = unit;
                        break; // exit the loop since the projectile can only hit one unit at a time
                    }
                }
            }
            
            for (let structureId of Object.keys(gameJsonCurrent.structures)) {
                let structure = gameJsonCurrent.structures[structureId];
                if (projectile.player !== structure.player && !structure.type.includes("base")) {
                    let distance = Math.sqrt(Math.pow(structure.position.x - projectile.position.x, 2) + Math.pow(structure.position.y - projectile.position.y, 2));
                    if (distance <= 1) {
                        //console.log("projectile " + projectileId + " has hit structure " + structureId);
                        projectile.alive = false;
                        structure.health -= 1;
                        if (structure.health <= 0) {
                            structure.alive = false;
                        }
                        gameJsonCurrent.structures[structureId] = structure;
                        break; // exit the loop since the projectile can only hit one structure at a time
                    }
                }
            }
        }
        

        // any of the projectiles that are off the map, set alive=false
        for (let projectileId of Object.keys(gameJsonCurrent.projectiles)) {
            try {
                let projectile = gameJsonCurrent.projectiles[projectileId];
                if (
                    projectile.position.x < 0 ||
                    projectile.position.x > gameJsonCurrent.mapSizeX ||
                    projectile.position.y < 0 ||
                    projectile.position.y > gameJsonCurrent.mapSizeY
                ) {
                    projectile.alive = false;
                }
            } catch (error) {
                console.log(error);
            }
        }

        // remove all projectiles with alive=false
        let projectilesToDelete = [];

        for (let projectileId of Object.keys(gameJsonCurrent.projectiles)) {
            let projectile = gameJsonCurrent.projectiles[projectileId];
            if (!projectile || !projectile.alive) {
                projectilesToDelete.push(projectileId);
            }
        }

        for (let projectileId of projectilesToDelete) {
            delete gameJsonCurrent.projectiles[projectileId];
        }
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
                            player.points = 0;
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

                // add to the units object the template for this unit
                unit = Object.assign(unit, UNIT_TEMPLATES[unit.type]);

                gameJsonCurrent.reserve[unitId] = unit;
            }
        }

        // if the structure.type is in the list of structures which can shoot projectiles,
        // check if the structure is cooling down and if not, shoot a projectile if there is a target
        if (["basic", "lazer", "grenade"].includes(structure.type)) {
            if (!structure.cooldown) {
                structure.cooldown = 0;
            }
            if (structure.cooldown <= 0) {
                let closestUnit = null;
                let closestStructure = null;
                let closestDistance = 1000000;
                for (let unitId of Object.keys(gameJsonCurrent.units)) {
                    let unit = gameJsonCurrent.units[unitId];
                    if (unit.player !== structure.player) {
                        let distance = Math.sqrt(Math.pow(unit.position.x - structure.position.x, 2) + Math.pow(unit.position.y - structure.position.y, 2));
                        if (distance <= structure.range && distance < closestDistance) {
                            closestDistance = distance;
                            closestUnit = unit;
                        }
                    }
                }

                if (!closestUnit) {
                    for (let structureId of Object.keys(gameJsonCurrent.structures)) {
                        let enemyStructure = gameJsonCurrent.structures[structureId];
                        if (enemyStructure.player !== structure.player && !enemyStructure.type.includes("base")) {
                            let distance = Math.sqrt(Math.pow(enemyStructure.position.x - structure.position.x, 2) + Math.pow(enemyStructure.position.y - structure.position.y, 2));
                            if (distance <= structure.range && distance < closestDistance) {
                                closestDistance = distance;
                                closestStructure = enemyStructure;
                            }
                        }
                    }
                }

                if (closestUnit) {
                    let projectileId = Math.random().toString(36);
                    let projectile = {
                        position: {
                            x: structure.position.x,
                            y: structure.position.y,
                        },
                        dx: 0,
                        dy: 0,
                        color: "red",
                        type: structure.type,
                        id: projectileId,
                        health: 1,
                        originalHealth: 1,
                        alive: true,
                        player: structure.player,
                    };

                    // calculate the dx and dy of the projectile
                    let distance = Math.sqrt(Math.pow(closestUnit.position.x - structure.position.x, 2) + Math.pow(closestUnit.position.y - structure.position.y, 2));
                    //console.log("distance is " + distance);
                    projectile.dx = (closestUnit.position.x - structure.position.x) / distance * 0.2;
                    projectile.dy = (closestUnit.position.y - structure.position.y) / distance * 0.2;

                    gameJsonCurrent.projectiles[projectileId] = projectile;
                    structure.cooldown = 15;
                } else if (closestStructure) {
                    let projectileId = Math.random().toString(36);
                    let projectile = {
                        position: {
                            x: structure.position.x,
                            y: structure.position.y,
                        },
                        dx: 0,
                        dy: 0,
                        color: "red",
                        type: structure.type,
                        id: projectileId,
                        health: 1,
                        originalHealth: 1,
                        alive: true,
                        player: structure.player,
                    };

                    // calculate the dx and dy of the projectile
                    let distance = Math.sqrt(Math.pow(closestStructure.position.x - structure.position.x, 2) + Math.pow(closestStructure.position.y - structure.position.y, 2));
                    //console.log("distance is " + distance);
                    projectile.dx = (closestStructure.position.x - structure.position.x) / distance * 0.2;
                    projectile.dy = (closestStructure.position.y - structure.position.y) / distance * 0.2;

                    gameJsonCurrent.projectiles[projectileId] = projectile;
                    structure.cooldown = 15;
                }
            } else {
                structure.cooldown -= 1;
            }
        }
    }

    // update unit positions
    for (let unitId of Object.keys(gameJsonCurrent.units)) {
        let unit = gameJsonCurrent.units[unitId];
        //console.log("updating unit " + unitId);
        //console.log(unit);
        if (unit.path.length > 0) {
            //console.log("unit has path" + unitId);
            let target = unit.path[0];

            // if the unit is not cooling down, move it towards the target
            if (unit.cooldown == 0) {
                //console.log("unit " + unitId + " is not cooling down so is moving towards target at " + target.x + ", " + target.y);
                unit.position.x = target.x;
                unit.position.y = target.y;
                unit.path.shift();
                unit.cooldown = unit.cooldownTime;

                // check if the unit is on the same square as an enemy base
                let enemyBaseIds = Object.keys(gameJsonCurrent.structures).filter(structureId => structureId.includes("base") && structureId !== unit.player + "_base");
                for (let enemyBaseId of enemyBaseIds) {
                    let enemyBase = gameJsonCurrent.structures[enemyBaseId];
                    if (enemyBase.position.x === unit.position.x && enemyBase.position.y === unit.position.y) {
                        // unit is on top of an enemy base, kill the unit and reduce the base's health
                        unit.alive = false;
                        enemyBase.health -= unit.damage;
                        gameJsonCurrent.structures[enemyBaseId] = enemyBase;
                        break; // exit the loop since the unit can only be on one base at a time
                    }
                }
            } else {
                //console.log("unit " + unitId + " is cooling down so is not moving");
                unit.cooldown -= 1;
            }
        }
        gameJsonCurrent.units[unitId] = unit;
    }

    // every 10 game ticks update the path of each unit using A* algorithm
    if (gameJsonCurrent.time % 10 == 0) {
        for (let unitId of Object.keys(gameJsonCurrent.units)) {
            let unit = gameJsonCurrent.units[unitId];
            let unitPosition = unit.position;
            let enemyIds = Object.keys(gameJsonCurrent.structures).filter(structureId => structureId.includes("base") && structureId !== unit.player + "_base");
            let randomEnemyId = enemyIds[Math.floor(Math.random() * enemyIds.length)];
            let targetPosition = gameJsonCurrent.structures[randomEnemyId].position;
            let path = find_path(unitPosition, targetPosition, gameJsonCurrent);
            unit.path = path;
            gameJsonCurrent.units[unitId] = unit;
        }
    }

    // every 10 game ticks if a player is holding down the 's' key then spawn a unit at their base
    // from the reserve
    if (gameJsonCurrent.time % 10 == 0) {
        for (let playerId of Object.keys(gameJsonCurrent.players)) {
            let player = gameJsonCurrent.players[playerId];
            if (player.keys.includes("s")) {
                //console.log("player " + playerId + " is holding down the 's' key");
                let playerBase = gameJsonCurrent.structures[playerId + "_base"];
                if (playerBase) {
                    let unitId = Object.keys(gameJsonCurrent.reserve)[0];
                    if (unitId) {
                        let unit = gameJsonCurrent.reserve[unitId];
                        unit.position.x = playerBase.position.x;
                        unit.position.y = playerBase.position.y;
                        unit.path = [];
                        unit.alive = true;
                        gameJsonCurrent.units[unitId] = unit;
                        delete gameJsonCurrent.reserve[unitId];
                    }
                }
            }
        }
    }

    // cull all dead units
    let unitsToDelete = [];
    for (let unitId of Object.keys(gameJsonCurrent.units)) {
        let unit = gameJsonCurrent.units[unitId];
        if (!unit || !unit.alive) {
            unitsToDelete.push(unitId);
        }
    }

    for (let unitId of unitsToDelete) {
        delete gameJsonCurrent.units[unitId];
    }

    // cull all dead structures
    let structuresToDelete = [];
    for (let structureId of Object.keys(gameJsonCurrent.structures)) {
        let structure = gameJsonCurrent.structures[structureId];
        if (!structure || !structure.alive) {
            structuresToDelete.push(structureId);
        }
    }

    for (let structureId of structuresToDelete) {
        delete gameJsonCurrent.structures[structureId];
    }


    return gameJsonCurrent;
}

module.exports = { updateGame, getInitialGameData, generateLobbyName };