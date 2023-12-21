import { useState, createContext, useEffect, useRef, useMemo } from 'react'
import './style.css'
import Api from '../../api.js'
import { getInitialGameData } from '../../utils/utils.js'
import { useParams } from 'react-router-dom';

export const APIContext = createContext([])

function GameScreen() {
    const { id } = useParams();
    const apiClient = useMemo(() => new Api(), [])

    const [serverurl, setServerurl] = useState(`${import.meta.env.VITE_SERVER_URL}`)
    const [gameData, setGameData] = useState(getInitialGameData(socket.id))

    // pick a random colour for the player and store it in a state
    const [colour, setColour] = useState('#' + Math.floor(Math.random() * 16777215).toString(16))

    useEffect(() => {
        // tell the server we joined and our meta info
        socket.emit('join', { id: socket.id, colour: colour });
    }, [])

    const keysPressed = useRef(new Set());
    const prevKeysPressed = useRef(new Set());

    // connect to the server using socket
    useEffect(() => {
        const fetchInitData = async () => {
            const res = await apiClient.getExample()
            setExampleText(res.data.exampleText)
            console.log(res)
        }
        fetchInitData()

        // Send a heartbeat 10 times per second
        const intervalId = setInterval(() => {
            socket.emit('heartbeat', {});
            console.log('heartbeat');
        }, 100);

        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [])

    // set up controller listeners
    useEffect(() => {

        const handleKeyDown = (event) => {
            keysPressed.current.add(event.key)
        }

        const handleKeyUp = (event) => {
            keysPressed.current.delete(event.key)
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        const updatePosition = () => {
            console.log("updatePosition ");
            console.log(keysPressed.current);
            console.log(prevKeysPressed.current);
            // if pressed keys have changed since last time
            if (!isEqual(prevKeysPressed.current, keysPressed.current)) {
                console.log("emitted keys");
                prevKeysPressed.current = new Set(keysPressed.current);
                socket.emit('keys', Array.from(keysPressed.current))
            }
            requestAnimationFrame(updatePosition)
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

        updatePosition()

        // Listen for 'position' events from the server
        socket.on('gameData', (gameData) => {
            setGameData(gameData)

            // Find us in the game data
            try {
                const me = gameData.players[socket.id]
                if (me) {
                    setPosition({
                        x: me.state.position.x,
                        y: me.state.position.y
                    })
                }
            } catch (err) {
                console.log(err)
            }
        })

        // Cleanup function
        return () => {
            // Remove event listener
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    console.log("gameData[players]");
    console.log(gameData["players"]);

    console.log("Object.keys(gameData['players'])");
    try {
        console.log(Object.keys(gameData["players"]));
    } catch (error) {
        console.log(error);
    }


    return (
        <APIContext.Provider value={{ apiClient }}>
            {
                gameData["mapSizeX"] && gameData["mapSizeY"] &&
                [...Array(gameData["mapSizeY"])].map((_, y) => (
                    <div className="row" key={y}>
                        {[...Array(gameData["mapSizeX"])].map((_, x) => (
                            <div className="square" key={x}></div>
                        ))}
                    </div>
                ))
            }
        </APIContext.Provider>
    )
}

export default GameScreen
