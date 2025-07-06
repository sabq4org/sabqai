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

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // استدعاء API تسجيل الخروج
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        // حذف البيانات من localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // إعادة التوجيه لصفحة تسجيل الدخول مع رسالة النجاح
        router.push('/login?logout=true')
      } else {
        // حتى لو فشل الطلب، نقوم بتسجيل الخروج محلياً
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/login?logout=true')
      }
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
      // تسجيل خروج محلي في حالة الخطأ
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login?logout=true')
    }
  }

  // التحقق من صلاحية إدارة المستخدمين
  const canManageUsers = userInfo?.permissions?.some(
    p => p.resource === 'users' && (p.action === 'create' || p.action === 'read')
  ) || false
  
  // التحقق من صلاحية عرض سجلات النشاط
  const canViewLogs = userInfo?.permissions?.some(
    p => p.resource === 'system' && p.action === 'view'
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
      {/* شريط علوي مع زر تسجيل الخروج */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم - سبق</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        {/* معلومات المستخدم الحالي */}
        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">معلومات الحساب</h2>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
            >
              تعديل الملف الشخصي
            </button>
          </div>
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
              {userInfo?.permissions && userInfo.permissions.length > 0 ? (
                userInfo.permissions.map((permission, index) => (
                  <div 
                    key={permission.id || `permission-${index}`}
                    className="bg-gray-100 rounded px-3 py-2 text-sm"
                  >
                    <span className="font-semibold">{permission.nameAr}</span>
                    <span className="text-gray-500 text-xs block">
                      {permission.resource}.{permission.action}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">لا توجد صلاحيات محددة</p>
              )}
            </div>
          </div>
        </div>

        {/* الروابط السريعة */}
        <div className="bg-white rounded-lg shadow-md mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">الروابط السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-right"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">الملف الشخصي</h3>
                  <p className="text-sm text-gray-600">تعديل بياناتك الشخصية</p>
                </div>
              </div>
            </button>

            {canManageUsers && (
              <button
                onClick={() => router.push('/dashboard/users')}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-right"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">إدارة المستخدمين</h3>
                    <p className="text-sm text-gray-600">إضافة وتعديل المستخدمين</p>
                  </div>
                </div>
              </button>
            )}

            {canViewLogs && (
              <button
                onClick={() => router.push('/dashboard/activity-logs')}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-right"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">سجل النشاطات</h3>
                    <p className="text-sm text-gray-600">مراقبة أنشطة النظام</p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>

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