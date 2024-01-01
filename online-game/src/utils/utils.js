export function getInitialGameData() {
    return {
        mapSizeX: 10,
        mapSizeY: 10,
        players: {

        },
    }
}

export function generateBoxShadows(rgb, times) {
    let boxShadow = '';
    for (let i = 0; i < times; i++) {
        if (i !== 0) boxShadow += ', ';
        boxShadow += `0 0 ${10 + i * 5}px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
    }
    return boxShadow;
}

export function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

export function getColor(distance) {
    const threshold = 1; // Set the threshold for determining the square color
    const fill = distance > threshold ? 'black' : '#444444';
    const border = distance > threshold ? '#111111' : '#555555';
    return { fill, border };
};

export const STRUCTURE_LIST = [
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
    }
]
