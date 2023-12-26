import React from 'react';
import './style.css';

const PlayerCircle = ({ player, squareSize, playerSize }) => {
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
            }}
        ></div>
    );
};

export default PlayerCircle;