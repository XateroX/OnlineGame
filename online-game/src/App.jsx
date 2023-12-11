import { useState, createContext, useEffect } from 'react'
import './App.css'
import Api from './api'

export const APIContext = createContext([])

function App() {
  const apiClient = new Api()

  const [exampleText, setExampleText] = useState('getting text...')
  const [exampleText2, setExampleText2] = useState({})

  useEffect(() => {
    const fetchInitData = async () => {
      const res = await apiClient.getExample()
      setExampleText(res.data.exampleText)
      setExampleText2(res.data)
      console.log(res)
    }
    fetchInitData()
  }, [])

  return (
    <APIContext.Provider value={{ apiClient }}>
      <p>{exampleText}</p>
      <p>{exampleText2}</p>
    </APIContext.Provider>
  )
}

export default App
