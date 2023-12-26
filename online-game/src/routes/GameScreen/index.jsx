import { useState, createContext, useContext, useEffect, useRef, useMemo } from 'react'
import './style.css'
import Api from '../../api.js'
import { getInitialGameData } from '../../utils/utils.js'
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../SocketContext';
import Game from './Game/index.jsx'

export const APIContext = createContext([])

function GameScreen() {
    const { id } = useParams();
    const apiClient = useMemo(() => new Api(), [])

    const { socket, isConnected } = useContext(SocketContext);

    const [serverurl, setServerurl] = useState(`${import.meta.env.VITE_SERVER_URL}`)
    const [gameData, setGameData] = useState(getInitialGameData())

    const keysPressed = useRef(new Set());
    const prevKeysPressed = useRef(new Set());
    const mousePosition = useRef({ x: 0, y: 0 })
    const prevMousePosition = useRef({ x: 0, y: 0 })

    // set up controller listeners
    useEffect(() => {
        if (!isConnected) return;
        const handleKeyDown = (event) => {
            keysPressed.current.add(event.key)
        }

        const handleKeyUp = (event) => {
            keysPressed.current.delete(event.key)
        }

        const handleMouse = (event) => {
            mousePosition.current.x = event.clientX
            mousePosition.current.y = event.clientY

            console.log("mousePosition");
            console.log(mousePosition);
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // add a mouse movement listener
        window.addEventListener('mousemove', handleMouse)

        const updateInput = () => {
            //console.log("updateInput ");
            //console.log(keysPressed.current);
            //console.log(prevKeysPressed.current);
            // if pressed keys have changed since last time, emit them
            if (!isEqual(prevKeysPressed.current, keysPressed.current) || prevMousePosition.current.x != mousePosition.current.x || prevMousePosition.current.y != mousePosition.current.y) {
                console.log("emitted keys and mouse");
                prevKeysPressed.current = new Set(keysPressed.current);
                prevMousePosition.current = { ...mousePosition.current }
                socket.emit('inputs', { keys: Array.from(keysPressed.current), mouse: mousePosition.current, playerId: sessionStorage.getItem('playerId') })
            }
            requestAnimationFrame(updateInput)
        }

        const isEqual = (setA, setB) => {
            if (setA.size != setB.size) {
                return false;
            }
            for (const key of setA) {
                if (!setB.has(key)) {
                    return false;
                }
            }
            return true;
        }

        updateInput()

        // Cleanup function
        return () => {
            // Remove event listener
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isConnected]);

    // set up game loop listeners
    useEffect(() => {
        if (!isConnected) return;

        console.log("game loop started listening");
        // Listen for gameJson events from the server
        socket.on('gameJson', (gameJson) => {
            setGameData(gameJson)
            console.log("gameJson");
            console.log(gameJson);
        })

        const joinLobby = () => {
            socket.emit('join', { lobbyCode: id });
            console.log('Sent join event');
        };

        joinLobby();
    }, [isConnected]);

    return (
        <div>
            <Game gameData={gameData} />
        </div>
    )
}

export default GameScreen
