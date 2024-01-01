import React from 'react';

import './style.css';
import PlayerCircle from '../../../components/Player';
import Square from '../../../components/Square';
import { hexToRgb, generateBoxShadows } from '../../../utils/utils';

const Game = (props) => {
    const { gameData } = props;
    const squareSize = gameData.squareSize; // Get squareSize from gameData
    const playerSize = squareSize; // Set the player size to be the same as the square size

    const playerId = sessionStorage.getItem('playerId');

    // calculate the colour of the square based on the distance to the players
    // save the results in an array to use later 
    const squareColours = [];

    try {
        for (let y = 0; y < gameData.mapSizeY; y++) {
            for (let x = 0; x < gameData.mapSizeX; x++) {
                let distance = 0;
                let player = gameData.players[playerId];
                distance += Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
                distance /= Object.values(gameData.players).length;
                squareColours.push(distance);
            }
        }
    } catch (error) {
        console.log(error);
    }

    return (
        <div style={{ backgroundColor: '#000000' }}>
            {gameData.mapSizeX &&
                gameData.mapSizeY &&
                [...Array(gameData.mapSizeY)].map((_, y) => (
                    <div className="row" key={y}>
                        {[...Array(gameData.mapSizeX)].map((_, x) => {
                            const distance = squareColours[x + y * gameData.mapSizeX];
                            return (
                                <Square
                                    key={`${x}-${y}`}
                                    x={x}
                                    y={y}
                                    squareSize={squareSize}
                                    distance={distance}
                                />
                            );
                        })}
                    </div>
                ))}

            {gameData.structures && Object.keys(gameData.structures).map((structId) => {
                const structJson = gameData.structures[structId];
                const structPosition = {
                    top: structJson.position.y * squareSize,
                    left: structJson.position.x * squareSize,
                };
                const color = gameData.players[structJson.player] && gameData.players[structJson.player].color || 'white';
                let rgb = hexToRgb(color);
                return (
                    <div
                        className={structJson.type}
                        key={structId}
                        style={{
                            backgroundColor: `${color}`,
                            width: squareSize,
                            height: squareSize,
                            border: `1px solid #444444`,
                            top: structPosition.top,
                            left: structPosition.left,
                            boxShadow: generateBoxShadows(rgb, 5)
                        }}
                    ></div>
                );
            })}
            {gameData.players &&
                Object.values(gameData.players).map((player, index) => (
                    <PlayerCircle
                        player={player}
                        squareSize={squareSize}
                        playerSize={playerSize}
                        key={index}
                    />
                ))}
            {gameData.rocks && Object.keys(gameData.rocks).map((rockId) => {
                const rock = gameData.rocks[rockId];
                const rockSize = rock.health / 3;
                const rockPosition = {
                    top: rock.y * squareSize + (squareSize - rockSize) / 2,
                    left: rock.x * squareSize + (squareSize - rockSize) / 2,
                };
                return (
                    <div
                        className="rock"
                        key={rockId}
                        style={{
                            position: 'absolute',
                            width: rockSize,
                            height: rockSize,
                            backgroundColor: `${rock.color}`,
                            border: `1px solid #444444`,
                            borderRadius: '50%',
                            ...rockPosition,
                        }}
                    ></div>
                );
            })}

            <div style={{ position: 'absolute', top: 0, right: 0, color: 'Yellow', backgroundColor: 'Black' }}>
                Points: {gameData.players[playerId] && Math.round(gameData.players[playerId].points) || 0}
            </div>
        </div>
    );
};

export default Game;
