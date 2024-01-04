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
]

module.exports = { STRUCTURE_LIST }