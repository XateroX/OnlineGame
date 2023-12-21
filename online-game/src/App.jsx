import { useState, createContext, useEffect, useRef, useMemo } from 'react'
import './App.css'
import Api from './api'
import { Unit } from './components/Unit'
import { getInitialGameData } from './utils/utils.js'
import HomeScreen from './routes/HomeScreen/index.jsx'

export const APIContext = createContext([])

import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import LoginScreen from './routes/LoginScreen/index.jsx';
import GameScreen from './routes/GameScreen/index.jsx';
import NewGameScreen from './routes/NewGameScreen/index.jsx';
import LobbyWaitingScreen from './routes/LobbyWaitingScreen/index.jsx'

function App() {
  return (
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
  );
}
export default App
