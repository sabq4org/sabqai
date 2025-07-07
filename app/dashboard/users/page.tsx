'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  PencilIcon,
  KeyIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { format, formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

interface User {
  id: string
  email: string
  name: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  role: {
    id: string
    name: string
    nameAr: string
  }
  _count: {
    sessions: number
    articles?: number
    comments?: number
  }
  lastActivity?: {
    action: string
    createdAt: string
  }
}

interface Stats {
  total: number
  active: number
  inactive: number
  byRole: Record<string, number>
  newToday: number
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: {},
    newToday: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    roleId: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const router = useRouter()

  // جلب المستخدمين
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        
        // حساب الإحصائيات
        const stats: Stats = {
          total: data.length,
          active: data.filter((u: User) => u.isActive).length,
          inactive: data.filter((u: User) => !u.isActive).length,
          byRole: {},
          newToday: data.filter((u: User) => 
            new Date(u.createdAt).toDateString() === new Date().toDateString()
          ).length
        }

        // حساب المستخدمين حسب الدور
        data.forEach((user: User) => {
          const roleName = user.role?.nameAr || 'بدون دور'
          stats.byRole[roleName] = (stats.byRole[roleName] || 0) + 1
        })

        setStats(stats)
      }
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error)
    } finally {
      setLoading(false)
    }
  }

  // جلب الأدوار
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
        setRoles(data)
      }
    } catch (error) {
      console.error('خطأ في جلب الأدوار:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  // فلترة المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                         user.email.toLowerCase().includes(filters.search.toLowerCase())
    const matchesRole = !filters.roleId || user.role?.id === filters.roleId
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && user.isActive) ||
                         (filters.status === 'inactive' && !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  }).sort((a, b) => {
    const sortValue = filters.sortOrder === 'asc' ? 1 : -1
    if (filters.sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '') * sortValue
    }
    if (filters.sortBy === 'lastLoginAt') {
      return ((new Date(b.lastLoginAt || 0).getTime() - new Date(a.lastLoginAt || 0).getTime()) * sortValue)
    }
    return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * sortValue
  })

  // تبديل حالة المستخدم
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة المستخدم:', error)
    }
  }

  // تغيير دور المستخدم
  const changeUserRole = async (userId: string, roleId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roleId })
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('خطأ في تغيير دور المستخدم:', error)
    }
  }

  // إعادة تعيين كلمة المرور
  const resetPassword = async (userId: string) => {
    if (!confirm('هل أنت متأكد من إعادة تعيين كلمة المرور؟')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني')
      }
    } catch (error) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', error)
    }
  }

  // حذف مستخدم
  const deleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error)
    }
  }

  // إرسال تنبيه
  const sendNotification = async (userId: string) => {
    // يمكن تطوير هذه الوظيفة لاحقاً
    alert('سيتم إرسال تنبيه للمستخدم')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* الرأس والإحصائيات */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p className="text-sm text-gray-500 mt-1">
              إدارة جميع المستخدمين والأدوار والصلاحيات
            </p>
          </div>
          <button
            onClick={() => {
              setEditingUser(null)
              setShowUserModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            مستخدم جديد
          </button>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <UsersIcon className="w-5 h-5" />
              <span className="text-sm">إجمالي المستخدمين</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircleIcon className="w-5 h-5" />
              <span className="text-sm">نشطون</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.active}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-600 mb-1">
              <XCircleIcon className="w-5 h-5" />
              <span className="text-sm">غير نشطين</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{stats.inactive}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="text-sm">مدراء</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {stats.byRole['مدير'] || 0}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <UserGroupIcon className="w-5 h-5" />
              <span className="text-sm">جدد اليوم</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.newToday}</p>
          </div>
        </div>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* البحث */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* زر الفلترة */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="w-5 h-5" />
            فلترة
          </button>
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.roleId}
              onChange={(e) => setFilters({ ...filters, roleId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">جميع الأدوار</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.nameAr}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                setFilters({ ...filters, sortBy, sortOrder })
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="createdAt-desc">الأحدث أولاً</option>
              <option value="createdAt-asc">الأقدم أولاً</option>
              <option value="name-asc">الاسم (أ-ي)</option>
              <option value="lastLoginAt-desc">آخر دخول</option>
            </select>
          </div>
        )}
      </div>

      {/* جدول المستخدمين */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المستخدم
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  الدور
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  آخر نشاط
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  الإحصائيات
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  تاريخ الانضمام
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'بدون اسم'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <select
                      value={user.role?.id || ''}
                      onChange={(e) => changeUserRole(user.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">بدون دور</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{role.nameAr}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleUserStatus(user.id, !user.isActive)}
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          نشط
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="w-4 h-4" />
                          غير نشط
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {user.lastLoginAt ? (
                        <>
                          <p className="text-gray-900">آخر دخول</p>
                          <p className="text-gray-500">
                            {formatDistanceToNow(new Date(user.lastLoginAt), { 
                              locale: ar,
                              addSuffix: true 
                            })}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">لم يسجل دخول بعد</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {user._count.sessions}
                      </span>
                      {user._count.articles !== undefined && (
                        <span className="flex items-center gap-1">
                          📝 {user._count.articles}
                        </span>
                      )}
                      {user._count.comments !== undefined && (
                        <span className="flex items-center gap-1">
                          💬 {user._count.comments}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-500">
                      {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: ar })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => resetPassword(user.id)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="إعادة تعيين كلمة المرور"
                      >
                        <KeyIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => sendNotification(user.id)}
                        className="p-1 text-gray-600 hover:text-yellow-600"
                        title="إرسال تنبيه"
                      >
                        <BellIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user)
                          setShowUserModal(true)
                        }}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="تعديل"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="حذف"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نموذج إضافة/تعديل مستخدم */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </h3>
            {/* محتوى النموذج سيتم إضافته لاحقاً */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 