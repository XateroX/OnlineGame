import { useState, createContext, useEffect, useRef, useMemo } from 'react'
import './App.css'
import Api from './api'
import socket from './socket/socket.js'
import { Unit } from './components/Unit'

export const APIContext = createContext([])

function App() {
  const apiClient = useMemo(() => new Api(), [])

  const [exampleText, setExampleText] = useState('getting text...')
  const [serverurl, setServerurl] = useState(`${import.meta.env.VITE_SERVER_URL}`)
  const [gameData, setGameData] = useState({})

  // pick a random colour for the player and store it in a state
  const [colour, setColour] = useState('#' + Math.floor(Math.random() * 16777215).toString(16))

  useEffect(() => {
    // Listen for 'connect' event from the server
    socket.emit('join', { id: socket.id, colour: colour });
  }, [])

  // position of the player
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })

  const keysPressed = useRef(new Set())

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
      socket.emit('keys', Array.from(keysPressed.current))
      requestAnimationFrame(updatePosition)
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
      <p>{exampleText}</p>
      <p>server url: {serverurl}</p>
      <Unit position={position} colour={colour} />
      {
        gameData["players"] &&
        Object.keys(gameData["players"]).map((id) => {
          return <Unit position={gameData["players"][id]["state"]["position"]} colour={gameData["players"][id]["state"]["colour"]} />
        })
      }
    </APIContext.Provider>
  )
}

export default App
