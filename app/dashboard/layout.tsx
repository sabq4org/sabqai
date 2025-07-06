'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // التحقق من تسجيل الدخول
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // تحميل إعدادات الوضع الليلي
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      setIsDarkMode(true)
      // لا حاجة لإضافة الكلاس هنا لأن ThemeProvider يتولى ذلك
    }

    setIsLoading(false)
  }, [router])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200" dir="rtl">
      {/* Sidebar - Fixed for desktop, drawer for mobile */}
      <div className={`fixed top-0 right-0 h-full z-30 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="lg:mr-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-20">
          <TopBar 
            toggleDarkMode={toggleDarkMode} 
            isDarkMode={isDarkMode}
            toggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Page Content */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
} 