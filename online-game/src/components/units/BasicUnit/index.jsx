import React from 'react';

const BasicUnit = ({ config }) => {
    const { color, position, squareSize, id } = config;
    const topOffset = position.y * squareSize + squareSize / 4;
    const leftOffset = position.x * squareSize + squareSize / 4;

    return (
        <div
            style={{
                position: 'absolute',
                width: '20px',
                height: '20px',
                top: topOffset,
                left: leftOffset,
                backgroundColor: color,
                border: '1px solid White',
                borderRadius: '30%',
                transition: 'top 0.5s ease, left 0.5s ease',
                overflow: 'visible',
                fontSize: '0.5em',
                fontWeight: 'bold',
            }}
            key={id}
        >{config.type}</div>
    );
};

export default BasicUnit;
