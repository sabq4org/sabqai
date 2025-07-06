'use client'

import { useEffect, useState } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // تطبيق الوضع الليلي من localStorage عند التحميل
    const applyTheme = () => {
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode === 'true') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    applyTheme()

    // الاستماع للتغييرات في localStorage من نوافذ أخرى
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        applyTheme()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // الاستماع للتغييرات المخصصة من نفس النافذة
    const handleThemeChange = () => {
      applyTheme()
    }

    window.addEventListener('theme-change', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('theme-change', handleThemeChange)
    }
  }, [])

  // تجنب مشاكل الـ hydration - عرض المحتوى مع تطبيق الثيم من الخادم
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
} 