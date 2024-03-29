import './style.css'
import { useState, useEffect } from 'react'

export function Unit(props) {
    const { position = { x: 0, y: 0 }, colour = "#000000", id } = props
    return (
        <div className="unit" style={{
            position: 'absolute',
            transform: `translate(${position.x * 5}px, ${position.y * 5}px)`,
            width: '50px',
            height: '50px',
            backgroundColor: colour
        }} key={id}></div>
    )
}