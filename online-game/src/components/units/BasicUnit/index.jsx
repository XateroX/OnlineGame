import React from 'react';

const BasicUnit = ({ config }) => {
    const { color, position, squareSize } = config;

    return (
        <div
            style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                top: position.y * squareSize,
                left: position.x * squareSize,
                backgroundColor: color,
                border: '1px solid White',
                transition: 'top 0.5s ease-in-out, left 0.5s ease-in-out'
            }}
        ></div>
    );
};

export default BasicUnit;
