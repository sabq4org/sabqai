'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

function LoginContent() {
  const [showLogoutMessage, setShowLogoutMessage] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // إظهار رسالة تسجيل الخروج إذا جاء من صفحة logout
    if (searchParams.get('logout') === 'true') {
      setShowLogoutMessage(true)
      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => {
        setShowLogoutMessage(false)
      }, 3000)
    }
  }, [searchParams])

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      {showLogoutMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          تم تسجيل الخروج بنجاح
        </div>
      )}
      <LoginForm />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  )
} 