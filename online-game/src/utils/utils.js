export function getInitialGameData() {
    return {
        mapSizeX: 10,
        mapSizeY: 10,
        players: {

        },
    }
}

export function getColor(distance) {
    const threshold = 1; // Set the threshold for determining the square color
    const fill = distance > threshold ? 'black' : '#444444';
    const border = distance > threshold ? '#111111' : '#555555';
    return { fill, border };
};

