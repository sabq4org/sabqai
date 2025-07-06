'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserList from '@/components/UserList'
import UserForm from '@/components/UserForm'

interface UserInfo {
  id: string
  email: string
  name: string
  role: {
    id: string
    name: string
    nameAr: string
  }
  permissions: Array<{
    id: string
    name: string
    nameAr: string
    resource: string
    action: string
  }>
}

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
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
      
      // التحقق من صلاحية الوصول للوحة التحكم
      const hasDashboardAccess = user.permissions?.some(
        (p: any) => p.resource === 'dashboard' && p.action === 'access'
      )
      
      if (!hasDashboardAccess) {
        alert('ليس لديك صلاحية الوصول للوحة التحكم')
        router.push('/')
      }
    } catch (error) {
      console.error('خطأ في قراءة بيانات المستخدم:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleUserAdded = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1)
  }

  // التحقق من صلاحية إدارة المستخدمين
  const canManageUsers = userInfo?.permissions?.some(
    p => p.resource === 'users' && (p.action === 'create' || p.action === 'read')
  ) || false

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto py-8 px-4">
        {/* معلومات المستخدم الحالي */}
        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">معلومات الحساب</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">الاسم:</p>
              <p className="font-semibold">{userInfo?.name || 'غير محدد'}</p>
            </div>
            <div>
              <p className="text-gray-600">البريد الإلكتروني:</p>
              <p className="font-semibold">{userInfo?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">الدور:</p>
              <p className="font-semibold">{userInfo?.role?.nameAr || userInfo?.role?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">عدد الصلاحيات:</p>
              <p className="font-semibold">{userInfo?.permissions?.length || 0} صلاحية</p>
            </div>
          </div>
          
          {/* عرض الصلاحيات */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">الصلاحيات المتاحة:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {userInfo?.permissions?.map((permission) => (
                <div 
                  key={permission.id}
                  className="bg-gray-100 rounded px-3 py-2 text-sm"
                >
                  <span className="font-semibold">{permission.nameAr}</span>
                  <span className="text-gray-500 text-xs block">
                    {permission.resource}.{permission.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">لوحة التحكم</h1>
        
        {/* قسم إدارة المستخدمين - يظهر فقط لمن لديه الصلاحية */}
        {canManageUsers ? (
          <>
            <div className="mb-6 text-center">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {showForm ? 'إخفاء النموذج' : 'إضافة مستخدم جديد'}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow-md mb-8">
                <UserForm onSuccess={handleUserAdded} />
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md">
              <UserList key={refreshKey} />
            </div>
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              ليس لديك صلاحية إدارة المستخدمين. يمكنك فقط عرض معلومات حسابك.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 