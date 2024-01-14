import React from 'react';
import { generateBoxShadows } from '../../../utils/utils';

const UnitFactory = ({ config }) => {
    const { color, squareSize, health, maxHealth, charge, maxCharge } = config;
    const healthPercentage = (health / maxHealth) * 100;
    const chargePercentage = (charge / maxCharge) * 100;

    return (
        <div className="unit_factory" style={{
            position: 'absolute',
            backgroundColor: color,
            width: squareSize,
            height: squareSize,
            top: config.position.y * squareSize,
            left: config.position.x * squareSize,
            border: '1px solid White',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                width: '100%',
                height: `${chargePercentage}%`,
                backgroundColor: 'blue',
                position: 'absolute',
                bottom: 0,
                left: 0,
            }}></div>
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
            <div style={{ 
                color: 'white', 
                fontSize: '20px', 
                textShadow: generateBoxShadows({ 'r': 0, 'g': 0, 'b': 0 }, 10),
                position: 'relative',
                zIndex: 9999,
            }}>
                U
            </div>
            
        </div>
    );
};

export default UnitFactory;
