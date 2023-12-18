// socket.js
import { io } from 'socket.io-client'

const serverurl = `${import.meta.env.VITE_SERVER_URL}`
const socket = io(serverurl)

export default socket