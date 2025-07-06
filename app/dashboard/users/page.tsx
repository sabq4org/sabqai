'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserList from '@/components/UserList'
import UserForm from '@/components/UserForm'

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [userInfo, setUserInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // جلب معلومات المستخدم من localStorage
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userData)
      setUserInfo(user)
      
      // التحقق من صلاحية إدارة المستخدمين
      const canManageUsers = user.permissions?.some(
        (p: any) => p.resource === 'users' && (p.action === 'create' || p.action === 'read')
      )
      
      if (!canManageUsers) {
        alert('ليس لديك صلاحية الوصول لهذه الصفحة')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('خطأ في قراءة بيانات المستخدم:', error)
      router.push('/login')
    }
  }, [router])

  const handleUserAdded = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          إدارة المستخدمين
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          إضافة وتعديل وحذف المستخدمين
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'إخفاء النموذج' : 'إضافة مستخدم جديد'}
        </button>
        
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-600 hover:text-gray-800"
        >
          العودة للوحة التحكم
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <UserForm onSuccess={handleUserAdded} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <UserList key={refreshKey} />
      </div>
    </div>
  )
} 