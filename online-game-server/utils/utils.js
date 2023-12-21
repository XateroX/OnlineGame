function getInitialGameData() {
    return {
        mapSizeX: 10,
        mapSizeY: 10,
        players: {
        },
    }
}

// function to generate random fun lobby name (3 simple words with hyphens)
function generateLobbyName() {
    const adjectives = ["flappy", "red", "green", "blue", "yellow", "fast", "slow", "happy", "sad", "jumping", "running", "sleepy", "quiet", "loud", "bright", "dark", "tiny", "huge", "slimy", "dry", "wet", "furry", "smooth", "rough", "tall", "short", "round", "square", "spiky", "curly"];
    const colors = ["aqua", "black", "blue", "fuchsia", "gray", "green", "lime", "maroon", "navy", "olive", "orange", "purple", "red", "silver", "teal", "white", "yellow", "azure", "ivory", "teal", "silver", "raspberry", "canary", "rosey", "plum", "sepia", "amethyst", "pearl", "scarlet", "bronze"];
    const nouns = ["goblin", "elephant", "cat", "dog", "bird", "fish", "mouse", "horse", "monkey", "lion", "tiger", "bear", "frog", "duck", "turtle", "rabbit", "squirrel", "owl", "beaver", "bison", "butterfly", "chameleon", "dolphin", "eagle", "flamingo", "gecko", "hippo", "iguana", "jellyfish", "kangaroo"];

    let adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    let color = colors[Math.floor(Math.random() * colors.length)];
    let noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}-${color}-${noun}`;
}


module.exports = { getInitialGameData, generateLobbyName };