'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDark(isDark)
  }, [])

  const toggle = () => {
    if (dark === null) return
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  if (dark === null) return <div className="w-8 h-8" />

  return (
    <button onClick={toggle} className="btn-icon" aria-label="Toggle dark mode">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
