import React from 'react';

const Base = ({ config }) => {
    const { color, squareSize } = config;

    return (
        <div className="base" style={{
            position: 'absolute',
            backgroundColor: color,
            width: squareSize,
            height: squareSize,
            top: config.position.y * squareSize,
            left: config.position.x * squareSize,
        }}>
        </div>
    );
};

export default Base;
