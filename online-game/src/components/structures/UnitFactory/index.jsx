import React from 'react';
import { generateBoxShadows } from '../../../utils/utils';

const UnitFactory = ({ config }) => {
    const { color, squareSize } = config;

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
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{ color: 'white', fontSize: '20px', textShadow: generateBoxShadows({ 'r': 0, 'g': 0, 'b': 0 }, 10), }}>
                U
            </div>
        </div>
    );
};

export default UnitFactory;
