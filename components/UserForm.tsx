'use client'

import { useState, useEffect } from 'react'

interface UserFormProps {
  onSuccess?: () => void
}

interface Role {
  id: string
  name: string
  nameAr: string
}

export default function UserForm({ onSuccess }: UserFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roleId: 'user-role-id' // الدور الافتراضي
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/roles', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles || [])
      }
    } catch (err) {
      console.error('خطأ في جلب الأدوار:', err)
      // استخدام قائمة افتراضية
      setRoles([
        { id: 'user-role-id', name: 'user', nameAr: 'مستخدم' },
        { id: 'editor-role-id', name: 'editor', nameAr: 'محرر' },
        { id: 'admin-role-id', name: 'admin', nameAr: 'مدير' }
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // إعادة تعيين النموذج
        setFormData({
          email: '',
          password: '',
          name: '',
          roleId: 'user-role-id'
        })
        
        if (onSuccess) onSuccess()
        alert('تم إنشاء المستخدم بنجاح!')
      } else {
        setError(data.error || 'حدث خطأ في إنشاء المستخدم')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">إضافة مستخدم جديد</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            كلمة المرور *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            الاسم
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            الدور
          </label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.nameAr || role.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'جاري الحفظ...' : 'إضافة مستخدم'}
        </button>
      </form>
    </div>
  )
} 