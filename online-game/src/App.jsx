import { useState, createContext, useEffect } from 'react'
import './App.css'
import Api from './api'
import io from 'socket.io-client'

export const APIContext = createContext([])

function App() {
  const apiClient = new Api()

  const [exampleText, setExampleText] = useState('getting text...');
  const [serverurl, setServerurl] = useState(`${import.meta.env.VITE_SERVER_URL}`);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [socketIdList, setSocketIdList] = useState([]);

  useEffect(() => {
    try {
      const socket = io(serverurl);

      // a heartbeat function to keep the connection alive
      setInterval(() => {
        socket.emit('heartbeat', {});
        console.log('heartbeat');
        console.log(socket.id)

        // if the socket.id isnt in the list, add it
        console.log('socketIdList');
        console.log(socketIdList);
        console.log('socket.id in list?');
        console.log(socketIdList.includes(socket.id));
        if (!socketIdList.includes(socket.id)) {
          setSocketIdList(socketIdList.concat(socket.id));
          console.log('should soon be ');
          console.log(socketIdList.concat(socket.id));
        }

        if (socket.id != socketIdList[0] && socketIdList.length > 1) {
          socket.disconnect();
        }
      }, 1000);

      socket.on('connect', () => {
        console.log('connected');
      });
      socket.on('playerPos', (data) => {
        console.log(data);
        setPlayerPos(data);
      });
      socket.on('gameData', (data) => {
        console.log('gameData');
        console.log(data);
      });
      socket.on('playerDisconnected', (data) => {
        console.log('playerDisconnected');
        console.log(data);
      });
    } catch (error) {
      console.log(error);
    }

    // Cleanup function
    return () => {
      socket.disconnect();

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <APIContext.Provider value={{ apiClient }}>
      <p>{exampleText}</p>
      <p>server url: {serverurl}</p>
      <div style={{ transform: `translate(${playerPos.x}px, ${playerPos.y}px)` }} className='playerBlob'>

      </div>
    </APIContext.Provider>
  )
}

export default App
