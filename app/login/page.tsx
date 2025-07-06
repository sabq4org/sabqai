'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<div className="text-center">جاري التحميل...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  )
} 