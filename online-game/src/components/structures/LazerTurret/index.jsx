import React, { useState, useEffect } from 'react';

const LazerTurret = ({ config }) => {
    const { color, squareSize } = config;

    const [angleOffset, setAngleOffset] = useState(Math.random() * Math.PI * 2);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngleOffset(Math.random() * Math.PI * 2);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const lineLength = squareSize * 0.4;
    const lineOffsetX = Math.cos(angleOffset) * squareSize * 0.3;
    const lineOffsetY = Math.sin(angleOffset) * squareSize * 0.3;

    return (
        <div className="lazer-turret" style={{
            position: 'absolute',
            backgroundColor: color,
            width: squareSize,
            height: squareSize,
            top: config.position.y * squareSize,
            left: config.position.x * squareSize,
            borderRadius: '50%',
            border: '1px solid White',
        }}>
            <div className="line" style={{
                position: 'absolute',
                backgroundColor: 'black',
                width: lineLength,
                height: '2px',
                top: squareSize * 0.5 - 1 + lineOffsetY,
                left: squareSize * 0.5 - lineLength / 2 + lineOffsetX,
                transform: `rotate(${angleOffset}rad)`,
                transition: 'top 0.5s ease-in-out, left 0.5s ease-in-out, transform 0.5s ease-in-out',
            }}></div>
        </div>
    );
};

export default LazerTurret;
