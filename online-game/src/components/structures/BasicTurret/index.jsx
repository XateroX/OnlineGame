import React, { useState, useEffect } from 'react';

const BasicTurret = ({ config }) => {
    const { color, squareSize, health, maxHealth } = config;

    const [angleOffset, setAngleOffset] = useState(Math.random() * Math.PI * 2);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngleOffset(Math.random() * Math.PI * 2);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const circleSize = squareSize * 0.25;
    const circleOffsetX = Math.cos(angleOffset) * squareSize * 0.3 - circleSize / 2;
    const circleOffsetY = Math.sin(angleOffset) * squareSize * 0.3 - circleSize / 2;

    const healthBarWidth = (health / maxHealth) * squareSize;
    const healthPercentage = (health / maxHealth) * 100;

    return (
        <div className="basic-turret" style={{
            position: 'absolute',
            backgroundColor: color,
            width: squareSize,
            height: squareSize,
            top: config.position.y * squareSize,
            left: config.position.x * squareSize,
            borderRadius: '50%',
            border: '1px solid White',
        }}>
            {health < maxHealth && (
                <div style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'red',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}>
                    <div style={{
                        width: `${healthPercentage}%`,
                        height: '100%',
                        backgroundColor: 'green',
                    }}></div>
                </div>
            )}
            <div className="circle" style={{
                position: 'absolute',
                backgroundColor: 'black',
                width: circleSize,
                height: circleSize,
                top: squareSize * 0.5 + circleOffsetY,
                left: squareSize * 0.5 + circleOffsetX,
                borderRadius: '50%',
                transform: `rotate(${angleOffset}rad)`,
                transition: 'top 0.5s ease-in-out, left 0.5s ease-in-out',
            }}></div>
        </div>
    );
};

export default BasicTurret;
