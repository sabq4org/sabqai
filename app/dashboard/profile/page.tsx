'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Calendar, Shield, Save, Camera } from 'lucide-react'

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // جلب معلومات المستخدم من localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setUserInfo(user)
      setFormData({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUserInfo(updatedUser)
        setIsEditing(false)
        alert('تم حفظ التغييرات بنجاح')
      }
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error)
      alert('حدث خطأ في حفظ البيانات')
    } finally {
      setIsLoading(false)
    }
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الملف الشخصي</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'إلغاء' : 'تعديل'}
          </button>
        </div>

        {/* Profile Image & Basic Info */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 left-0 w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{userInfo.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{userInfo.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                <Shield className="w-3 h-3" />
                {userInfo.role?.nameAr || 'مستخدم'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-3 h-3 inline ml-1" />
                عضو منذ {new Date(userInfo.createdAt).toLocaleDateString('ar')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">معلومات الحساب</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الاسم الكامل
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900 dark:text-white">{userInfo.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
            ) : (
              <p className="text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {userInfo.email}
              </p>
            )}
          </div>



          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الدور
            </label>
            <p className="text-gray-900 dark:text-white">
              {userInfo.role?.nameAr || 'مستخدم'}
            </p>
          </div>
        </div>



        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              حفظ التغييرات
            </button>
          </div>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">الأمان</h3>
        
        <div className="space-y-4">
          <button className="w-full text-right px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">تغيير كلمة المرور</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">قم بتحديث كلمة المرور الخاصة بك</p>
          </button>

          <button className="w-full text-right px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="font-medium text-gray-900 dark:text-white">المصادقة الثنائية</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">أضف طبقة حماية إضافية لحسابك</p>
          </button>
        </div>
      </div>
    </div>
  )
} 