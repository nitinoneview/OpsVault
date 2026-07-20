'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved ? saved === 'dark' : prefersDark
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newValue = !isDark
    setIsDark(newValue)
    document.documentElement.classList.toggle('dark', newValue)
    localStorage.setItem('theme', newValue ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30 px-3 py-2 rounded-md text-sm font-medium transition"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
