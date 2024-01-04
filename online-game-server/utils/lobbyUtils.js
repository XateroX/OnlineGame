function togglePlayerInLobbyReadyState(lobbyJson, playerId) {
    Object.keys(lobbyJson.players).forEach((socketid) => {
        if (lobbyJson.players[socketid].playerId == playerId) {
            lobbyJson.players[socketid].ready = !lobbyJson.players[socketid].ready;
        }
    });
    return lobbyJson;
}

module.exports = { togglePlayerInLobbyReadyState } 