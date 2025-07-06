'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: {
    id: string
    name: string
    nameAr: string
  } | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // حقول النموذج
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setName(data.user.name || '')
        setEmail(data.user.email)
      } else if (response.status === 401) {
        router.push('/login')
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'حدث خطأ في جلب البيانات' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالخادم' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // التحقق من تطابق كلمة المرور الجديدة
    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمة المرور الجديدة غير متطابقة' })
      return
    }

    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('token')
      const updateData: any = { name, email }
      
      if (newPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'تم تحديث البيانات بنجاح' })
        
        // تحديث البيانات المحلية
        if (data.user) {
          setProfile(data.user)
          const userData = JSON.parse(localStorage.getItem('user') || '{}')
          localStorage.setItem('user', JSON.stringify({
            ...userData,
            ...data.user
          }))
        }

        // مسح حقول كلمة المرور
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowPasswordFields(false)
      } else {
        setMessage({ type: 'error', text: data.error || 'حدث خطأ في تحديث البيانات' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'حدث خطأ في الاتصال بالخادم' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* شريط علوي */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">تعديل الملف الشخصي</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-800"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* رسائل النجاح/الخطأ */}
          {message.text && (
            <div className={`mb-4 p-4 rounded ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* معلومات الحساب */}
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">
              <p><strong>معرف الحساب:</strong> {profile?.id}</p>
              <p><strong>الدور:</strong> {profile?.role?.nameAr || 'غير محدد'}</p>
            </div>
          </div>

          {/* نموذج التعديل */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* الاسم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="أدخل اسمك"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* زر تغيير كلمة المرور */}
              <div className="border-t pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showPasswordFields ? 'إلغاء تغيير كلمة المرور' : 'تغيير كلمة المرور'}
                </button>
              </div>

              {/* حقول كلمة المرور */}
              {showPasswordFields && (
                <div className="space-y-4 border p-4 rounded bg-gray-50">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الحالية
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={showPasswordFields}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="6 أحرف على الأقل"
                      required={showPasswordFields}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={showPasswordFields}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* أزرار الإجراءات */}
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 