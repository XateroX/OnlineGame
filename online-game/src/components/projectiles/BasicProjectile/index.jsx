import React from 'react';

const BasicProjectile = ({ config }) => {
    const { position, dx, dy, id, squareSize } = config;
    const tailLength = 10; // Number of tail segments
    const tailSegmentSize = 5; // Size of each tail segment

    let x = position.x;
    let y = position.y;

    return (
        <div
            style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                top: y,
                left: x,
                backgroundColor: 'red',
                border: '1px solid White',
                transition: 'top 0.5s ease, left 0.5s ease',
                overflow: 'visible',
                fontSize: '0.5em',
                fontWeight: 'bold',
                transition: 'top 0.5s ease, left 0.5s ease',
            }}
            key={id}
        >{config.type}</div>
    );
};

export default BasicProjectile;
