import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

const messages = [
  "Cargando...",
  "Trayendo registros de la base de datos...",
  "Preparando todo para ti...",
  "Casi listo...",
  "Trabajando en ello...",
  "Conectando con el servidor...",
  "Ya casi...",
]

export default function LoadingScreen({ theme, setTheme }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#ddd9ce] dark:bg-[#0a1118]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(17,50,32,0.06)_1px,transparent_0)] dark:bg-[radial-gradient(rgba(197,160,89,0.1)_1px,transparent_0)] [background-size:24px_24px]" />

      <button
        onClick={toggle}
        className="fixed top-6 right-6 z-50 p-2.5 rounded-xl border transition-all duration-200 backdrop-blur-sm bg-[rgba(232,229,219,0.88)] dark:bg-[rgba(20,30,45,0.35)] border-[rgba(17,50,32,0.08)] dark:border-[rgba(255,255,255,0.05)] text-andes-slate dark:text-white/90 hover:bg-[rgba(224,221,210,0.9)] dark:hover:bg-[rgba(20,30,45,0.5)]"
        aria-label="Cambiar tema"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-3xl opacity-20 bg-andes-gold" />
          <img
            src="/logo.png"
            alt="AndesTur"
            className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-lg"
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-andes-forest dark:text-andes-bone">
          AndesTur
        </h1>

        <div className="w-64 md:w-80">
          <div className="h-1 rounded-full bg-andes-forest/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-andes-gold/80 via-andes-gold to-andes-gold/80"
              style={{ animation: 'wsLoadingBar 2s ease-in-out infinite' }}
            />
          </div>
        </div>

        <p className="text-sm md:text-base text-andes-slate/70 dark:text-white/70 animate-pulse tracking-wide">
          {messages[messageIndex]}
        </p>
      </div>

      <style>{`@keyframes wsLoadingBar{0%{transform:translateX(-100%);width:30%}50%{transform:translateX(200%);width:60%}100%{transform:translateX(500%);width:30%}}`}</style>
    </div>
  )
}
