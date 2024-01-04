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
                borderRadius: '30%',
                transition: 'top 0.5s ease-in-out, left 0.5s ease-in-out',
                overflow: 'visible',
                fontSize: '0.5em',
                fontWeight: 'bold',
            }}
        >{config.type}</div>
    );
};

export default BasicUnit;
