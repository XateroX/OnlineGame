import React from 'react';
import './style.css';
import { STRUCTURE_LIST } from '../../utils/utils';

const PlayerCircle = ({ player, squareSize, playerSize }) => {
    const gridColumns = Math.ceil(5);
    const gridRows = Math.ceil(2);

    return (
        <div
            className="playerCircle"
            style={{
                position: 'absolute',
                top: player.y * squareSize + (squareSize - playerSize) / 2,
                left: player.x * squareSize + (squareSize - playerSize) / 2,
                backgroundColor: player.color,
                borderRadius: '50%',
                width: playerSize,
                height: playerSize,
                overflow: 'visible',
            }}
        >
            {player.building && (
                <div
                    className="grid"
                    style={{
                        position: 'absolute',
                        top: -(gridRows * squareSize - playerSize) / 2,
                        left: -(gridColumns * squareSize - playerSize) / 2,
                        width: gridColumns * squareSize,
                        height: gridRows * squareSize,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                        gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                        gap: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {Array.from({ length: gridRows }, (_, row) =>
                        Array.from({ length: gridColumns }, (_, col) => {
                            let struct = STRUCTURE_LIST[row * gridColumns + col];
                            return (
                                <div
                                    key={`${row}-${col}`}
                                    style={{
                                        backgroundColor: (row * gridColumns + col == (player.buildingIndex % STRUCTURE_LIST.length)) ? player.color : 'white',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    <p style={{
                                        width: '4em',
                                        height: '3em',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'wrap',
                                        fontSize: '0.75em',
                                    }}>{
                                            struct && struct.name || 'NONE'
                                        }</p>
                                </div>)
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default PlayerCircle;