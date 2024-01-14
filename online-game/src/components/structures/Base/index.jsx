import React from 'react';
import { generateBoxShadows } from '../../../utils/utils';

const Base = ({ config }) => {
    const { color, squareSize, health } = config;

    return (
        <div className="base" style={{
            position: 'absolute',
            backgroundColor: color,
            width: squareSize,
            height: squareSize,
            top: config.position.y * squareSize,
            left: config.position.x * squareSize,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid White',
            boxShadow: generateBoxShadows({ 'r': 255, 'g': 255, 'b': 255 }, 2)
        
        }}>
            <div className="health" style={{
                backgroundColor: 'transparent',
                color: 'white', 
                textShadow: generateBoxShadows({ 'r': 0, 'g': 0, 'b': 0 }, 10),
                
            }}>
                {health}
            </div>

        </div>
    );
};

export default Base;
