'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
    
    // تطبيق الوضع الليلي من localStorage عند التحميل
    const savedDarkMode = localStorage.getItem('darkMode')
    const isDark = savedDarkMode === 'true'
    setTheme(isDark ? 'dark' : 'light')
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (!mounted) return // لا تسمح بالتبديل قبل التحميل
    
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
    
    // إطلاق حدث مخصص للنوافذ الأخرى
    window.dispatchEvent(new Event('theme-change'))
  }

  // Always provide the context, even before mounting
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
} 