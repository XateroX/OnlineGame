import React from 'react';
import './style.css';
import { getColor } from '../../utils/utils';

const Square = ({ x, y, squareSize, distance }) => {
    const { fill, border } = getColor(distance);

    return (
        <div
            className="square"
            key={`${x}-${y}`}
            style={{
                position: 'absolute',
                top: y * squareSize,
                left: x * squareSize,
                width: squareSize,
                height: squareSize,
                backgroundColor: fill,
                border: `1px solid ${border}`,
            }}
        ></div>
    );
};

export default Square;
