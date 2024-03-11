import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Subordinate } from '../../../'
import './App.css'

const subordinate = new Subordinate({
  targetOrigin: 'http://localhost:5174',
  onError: err => {
    console.log(err)
  }
})
subordinate.init()

function App() {
  const token = new URL(window.location.href).searchParams.get('token')
  const [bool, setBool] = useState(true)

  subordinate.subscribe('changeBool', (payload: boolean) => {
    console.log('%cMark🔸>>>', 'color: red;', payload)
    setBool(payload)
  })

  subordinate.subscribe('hello', (payload: string) => {
    console.log(payload, 'world')
  })

  return (
    <>
      <div>
        <div>{token === '123' && bool ? token + '已鉴权' : '无权限'}</div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <button
        onClick={() => {
          subordinate.send('xixihaha', 'to father')
        }}
      >
        to father
      </button>
    </>
  )
}

export default App
