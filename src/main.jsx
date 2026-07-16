import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

const API_BASE = import.meta.env.VITE_API_URL || ''

function Root() {
  const [backendReady, setBackendReady] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    const checkBackend = async () => {
      while (!cancelled) {
        try {
          const res = await fetch(`${API_BASE}/api/`)
          if (res.ok) {
            if (!cancelled) setBackendReady(true)
            return
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 3000))
      }
    }
    checkBackend()
    return () => { cancelled = true }
  }, [])

  if (!backendReady) {
    return <LoadingScreen theme={theme} setTheme={setTheme} />
  }

  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
