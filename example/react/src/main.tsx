import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import '@/styles/mian.css'
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root') as Element).render(
  // <StrictMode>
  <App />
  // </StrictMode>
)
