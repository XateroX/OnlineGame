import { useState, createContext, useEffect } from 'react'
import './App.css'
import Api from './api'

export const APIContext = createContext([])

function App() {
  const apiClient = new Api()

  const [exampleText, setExampleText] = useState('getting text...')
  const [serverurl, setServerurl] = useState(`${process.env.VITE_SERVER_URL}`)

  useEffect(() => {
    const fetchInitData = async () => {
      const res = await apiClient.getExample()
      setExampleText(res.data.exampleText)
      console.log(res)
    }
    fetchInitData()
  }, [])

  return (
    <APIContext.Provider value={{ apiClient }}>
      <p>{exampleText}</p>
      <p>server url: {serverurl}</p>
    </APIContext.Provider>
  )
}

export default App
