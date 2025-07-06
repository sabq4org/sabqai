'use client'

import { useState, useEffect } from 'react'

interface Role {
  id: string
  name: string
  nameAr: string
}

interface UserEditFormProps {
  userId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function UserEditForm({ userId, onSuccess, onCancel }: UserEditFormProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // بيانات المستخدم
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // قائمة الأدوار
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    fetchUserData()
    fetchRoles()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setName(data.user.name || '')
        setEmail(data.user.email)
        setRoleId(data.user.role?.id || '')
      } else {
        const data = await response.json()
        setError(data.error || 'حدث خطأ في جلب بيانات المستخدم')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles)
      }
    } catch (err) {
      console.error('خطأ في جلب الأدوار:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // التحقق من تطابق كلمة المرور
    if (newPassword && newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const updateData: any = { name, email, roleId }
      
      if (newPassword) {
        updateData.password = newPassword
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('تم تحديث بيانات المستخدم بنجاح')
        setNewPassword('')
        setConfirmPassword('')
        
        // استدعاء دالة النجاح بعد ثانيتين
        setTimeout(() => {
          if (onSuccess) onSuccess()
        }, 2000)
      } else {
        setError(data.error || 'حدث خطأ في تحديث البيانات')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center p-4">جاري تحميل بيانات المستخدم...</div>
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">تعديل بيانات المستخدم</h3>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="اسم المستخدم"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          {/* الدور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الدور
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">اختر الدور</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nameAr} ({role.name})
                </option>
              ))}
            </select>
          </div>

          {/* كلمة مرور جديدة */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              تغيير كلمة المرور (اختياري)
            </h4>
            
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="كلمة مرور جديدة (6 أحرف على الأقل)"
              />
              
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="تأكيد كلمة المرور الجديدة"
              />
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  )
} 