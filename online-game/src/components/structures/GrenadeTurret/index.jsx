import React, { useState, useEffect } from 'react';

const GrenadeTurret = ({ config }) => {
    const { color, squareSize, health, maxHealth } = config;

    const [angleOffset, setAngleOffset] = useState(Math.random() * Math.PI * 2);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngleOffset(prevAngleOffset => prevAngleOffset + 0.02);
        }, 10);

        return () => clearInterval(interval);
    }, []);

    const circleRadius = squareSize * 0.2;
    const circleOffset = circleRadius * 1.5;

    const balls = [
        { offsetX: Math.cos(angleOffset + 0) * circleOffset, offsetY: Math.sin(angleOffset + 0) * circleOffset },
        { offsetX: Math.cos(angleOffset + (Math.PI * 2) / 3) * circleOffset, offsetY: Math.sin(angleOffset + (Math.PI * 2) / 3) * circleOffset },
        { offsetX: Math.cos(angleOffset + ((Math.PI * 2) / 3) * 2) * circleOffset, offsetY: Math.sin(angleOffset + ((Math.PI * 2) / 3) * 2) * circleOffset }
    ];

    const healthBarWidth = (health / maxHealth) * squareSize;
    const healthPercentage = (health / maxHealth) * 100;

    return (
        <div className="grenade-turret" style={{
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
            {balls.map((ball, index) => (
                <div key={index} style={{
                    position: 'absolute',
                    backgroundColor: 'black',
                    width: circleRadius,
                    height: circleRadius,
                    borderRadius: '50%',
                    top: squareSize * 0.5 - circleRadius / 2 + ball.offsetY,
                    left: squareSize * 0.5 - circleRadius / 2 + ball.offsetX,
                    //transition: 'top 0.01s ease-in-out, left 0.01s ease-in-out',
                }}></div>
            ))}
        </div>
    );
};

export default GrenadeTurret;
