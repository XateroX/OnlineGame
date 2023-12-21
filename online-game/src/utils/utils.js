export function getInitialGameData(id) {
    return {
        mapSizeX: 10,
        mapSizeY: 10,
        players: {
            id: {
                id: id,
                name: 'None',
                state: {
                    mousePosition: {
                        x: 0,
                        y: 0,
                    },
                    mapDict: {
                    },
                    keys: [],
                },
            },
        },
    }
}

