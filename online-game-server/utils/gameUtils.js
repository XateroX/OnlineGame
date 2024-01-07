const STRUCTURE_LIST = [
    {
        id: 0,
        name: 'Basic Turret',
        type: 'basic',
        cost: 10,
        health: 10,
        color: '#444444',
    },
    {
        id: 0,
        name: 'Lazer Turret',
        type: 'lazer',
        cost: 100,
        health: 50,
        color: '#444444',
    },
    {
        id: 0,
        name: 'Grenade Turret',
        type: 'grenade',
        cost: 200,
        health: 100,
        color: '#444444',
    },
    {
        id: 0,
        name: 'Unit Factory',
        type: 'unit_factory',
        cost: 200,
        health: 300,
        unitType: 'basic',
        color: '#444444',
        maxCharge: 1000,
    }
];

const UNIT_TEMPLATES = {
    basic: {
        health: 10,
        damage: 1,
        cooldownTime: 40,
        cooldown: 0,
        color: '#444444',
    },
};

function find_path(unitPosition, targetPosition, gameJsonCurrent) {
    // implementation of simple pathfinding algorithm
    
    //console.log('find_path running');
    let path = [];

    // lets turn the gameJsonCurrent into a 2d array of booleans
    // true = empty, false = occupied
    let grid = [];

    //console.log('gameJsonCurrent', gameJsonCurrent);

    // based on the map size create a 2d array
    for (let x = 0; x < gameJsonCurrent.mapSizeX; x++) {
        grid[x] = [];
        for (let y = 0; y < gameJsonCurrent.mapSizeY; y++) {
            grid[x][y] = true;
        }
    }

    // starting with structures
    for (let structureId of Object.keys(gameJsonCurrent.structures)) {
        let structure = gameJsonCurrent.structures[structureId];
        let x = structure.position.x;
        let y = structure.position.y;
        if (!grid[x]) grid[x] = [];
        if (x !== targetPosition.x || y !== targetPosition.y) {
            grid[x][y] = false;
        }
    }

    // using the grid implement a simple floodfill algorithm
    path = floodFillSearch(unitPosition, targetPosition, grid);
    return path;
}

function floodFillSearch(unitPosition, targetPosition, grid) {
    const queue = [];
    const visited = new Set();
    const path = new Map();

    const isValidPosition = (x, y) => {
        return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length && grid[x][y];
    };

    const enqueue = (x, y, prevX, prevY) => {
        if (!visited.has(`${x},${y}`)) {
            queue.push({ x, y });
            visited.add(`${x},${y}`);
            path.set(`${x},${y}`, { prevX, prevY });
        }
    };

    const getNeighbors = (x, y) => {
        const neighbors = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (isValidPosition(newX, newY)) {
                neighbors.push({ x: newX, y: newY });
            }
        }

        return neighbors;
    };

    enqueue(unitPosition.x, unitPosition.y, null, null);

    while (queue.length > 0) {
        const { x, y } = queue.shift();

        if (x === targetPosition.x && y === targetPosition.y) {
            // Build path from target position to initial position
            const finalPath = [];
            let currentX = x;
            let currentY = y;

            while (currentX !== unitPosition.x || currentY !== unitPosition.y) {
                finalPath.unshift({ x: currentX, y: currentY });
                const { prevX, prevY } = path.get(`${currentX},${currentY}`);
                currentX = prevX;
                currentY = prevY;
            }

            return finalPath;
        }

        const neighbors = getNeighbors(x, y);

        for (const neighbor of neighbors) {
            enqueue(neighbor.x, neighbor.y, x, y);
        }
    }

    return []; // Target position not found
}


function getPositionKey(position) {
    return `${position.x},${position.y}`;
}




module.exports = { STRUCTURE_LIST, UNIT_TEMPLATES, find_path }