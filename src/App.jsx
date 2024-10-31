import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SortComp from './SortComp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SortComp />
    </>
  )
}

export default App
