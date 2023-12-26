import { useState, createContext, useEffect, useRef, useMemo } from 'react'
import './App.css'
import Api from './api'
import { Unit } from './components/Unit'
import { getInitialGameData } from './utils/utils.js'
import HomeScreen from './routes/HomeScreen/index.jsx'
import { io } from 'socket.io-client';
import { SocketContext } from './SocketContext';

export const APIContext = createContext([])

import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import LoginScreen from './routes/LoginScreen/index.jsx';
import GameScreen from './routes/GameScreen/index.jsx';
import NewGameScreen from './routes/NewGameScreen/index.jsx';
import LobbyWaitingScreen from './routes/LobbyWaitingScreen/index.jsx'

function App() {
  const socketRef = useRef();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverurl = `${import.meta.env.VITE_SERVER_URL}`
    socketRef.current = io(serverurl);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    // Send a heartbeat 10 times per second
    const intervalId = setInterval(() => {
      socketRef.current.emit('heartbeat', { playerId: sessionStorage.getItem('playerId') });
      console.log('heartbeat');
    }, 100);
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/game/:id" element={<GameScreen />} />
            <Route path="/newgame" element={<NewGameScreen />} />
            <Route path="/lobbywaitingroom/:id" element={<LobbyWaitingScreen />} />
          </Routes>
        </div>
      </Router>
    </SocketContext.Provider >
  );
}
export default App
