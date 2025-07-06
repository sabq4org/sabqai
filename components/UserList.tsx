'use client'

import { useState, useEffect } from 'react'
import UserEditForm from './UserEditForm'

interface User {
  id: string
  email: string
  name: string | null
  role: {
    id: string
    name: string
    nameAr: string
  } | null
  sessionsCount?: number
  createdAt: string
  updatedAt: string
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users)
      } else {
        setError(data.error || 'حدث خطأ في جلب المستخدمين')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id))
      } else {
        const data = await response.json()
        alert(data.error || 'حدث خطأ في حذف المستخدم')
      }
    } catch (err) {
      alert('حدث خطأ في الاتصال بالخادم')
    }
  }

  const handleEditSuccess = () => {
    setEditingUserId(null)
    fetchUsers() // إعادة جلب البيانات
  }

  if (loading) {
    return <div className="text-center p-4">جاري التحميل...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  // إذا كان هناك مستخدم يتم تعديله، أظهر نموذج التعديل
  if (editingUserId) {
    return (
      <UserEditForm
        userId={editingUserId}
        onSuccess={handleEditSuccess}
        onCancel={() => setEditingUserId(null)}
      />
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">قائمة المستخدمين</h2>
      
      {users.length === 0 ? (
        <p className="text-gray-500">لا يوجد مستخدمون حالياً</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-right">الاسم</th>
                <th className="px-4 py-2 border-b text-right">البريد الإلكتروني</th>
                <th className="px-4 py-2 border-b text-right">الدور</th>
                <th className="px-4 py-2 border-b text-right">الجلسات النشطة</th>
                <th className="px-4 py-2 border-b text-right">تاريخ الإنشاء</th>
                <th className="px-4 py-2 border-b text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{user.name || 'غير محدد'}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {user.role?.nameAr || user.role?.name || 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <span className="text-gray-600">
                      {user.sessionsCount || 0}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    {new Date(user.createdAt).toLocaleDateString('ar')}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setEditingUserId(user.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 