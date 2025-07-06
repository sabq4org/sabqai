'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, ShieldCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ResponsiveTable from '@/components/dashboard/ResponsiveTable'
import Card from '@/components/dashboard/Card'

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface Role {
  id: string
  name: string
  description: string | null
  is_system: boolean
  permissions: Permission[]
  _count?: {
    users: number
  }
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
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
        // التأكد من أن كل دور لديه مصفوفة permissions
        const rolesWithPermissions = (data.roles || []).map((role: any) => ({
          ...role,
          permissions: role.permissions || []
        }))
        setRoles(rolesWithPermissions)
      }
    } catch (error) {
      console.error('خطأ في جلب الأدوار:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/permissions', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPermissions(data.permissions || [])
      }
    } catch (error) {
      console.error('خطأ في جلب الصلاحيات:', error)
    }
  }

  const handleDelete = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    const message = role?._count?.users && role._count.users > 0
      ? `هذا الدور مرتبط بـ ${role._count.users} مستخدم. هل أنت متأكد من حذفه؟`
      : 'هل أنت متأكد من حذف هذا الدور؟'
    
    if (!confirm(message)) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        fetchRoles()
      } else {
        const error = await response.json()
        alert(error.error || 'لا يمكن حذف هذا الدور')
      }
    } catch (error) {
      console.error('خطأ في حذف الدور:', error)
      alert('حدث خطأ في حذف الدور')
    }
  }

  const columns = [
    { 
      key: 'name', 
      label: 'الدور',
      render: (value: any, role: Role) => (
        <div className="flex items-center gap-2">
          <ShieldCheckIcon 
            className={`w-5 h-5 ${
              role?.is_system 
                ? 'text-purple-500 dark:text-purple-400' 
                : 'text-gray-400'
            }`} 
            title={role?.is_system ? "دور نظام محمي" : "دور مخصص"}
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {role?.name}
              {role?.name === 'super_admin' && (
                <span className="mr-2 text-xs text-red-600 dark:text-red-400">⭐</span>
              )}
            </div>
            {role?.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400" title={role.description}>
                {role.description}
              </div>
            )}
          </div>
        </div>
      )
    },
    { 
      key: 'permissions_count', 
      label: 'عدد الصلاحيات',
      render: (value: any, role: Role) => role?.permissions?.length || 0
    },
    { 
      key: 'users_count', 
      label: 'عدد المستخدمين',
      render: (value: any, role: Role) => role?._count?.users || 0
    },
    { 
      key: 'is_system', 
      label: 'النوع',
      render: (value: any, role: Role) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          role?.is_system 
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {role?.is_system ? 'دور نظام' : 'دور مخصص'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (value: any, role: Role) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedRole(role)
              setShowModal(true)
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20"
            title="تعديل"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          {!role?.is_system && (
            <button
              onClick={() => handleDelete(role?.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"
              title="حذف"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // فلترة الأدوار حسب البحث
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة الصلاحيات والأدوار</h1>
        <button
          onClick={() => {
            setSelectedRole(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          <span>إضافة دور</span>
        </button>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="space-y-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الأدوار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {searchTerm && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredRoles.length > 0 
                ? `تم العثور على ${filteredRoles.length} ${filteredRoles.length === 1 ? 'دور' : 'أدوار'}`
                : 'لا توجد نتائج مطابقة'
              }
            </div>
          )}
        </div>
      </Card>

      {/* Roles Table */}
      <Card>
        <ResponsiveTable
          data={filteredRoles}
          columns={columns}
          keyField="id"
          emptyMessage={searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا توجد أدوار"}
        />
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <RoleModal
          role={selectedRole}
          permissions={permissions}
          onClose={() => {
            setShowModal(false)
            setSelectedRole(null)
          }}
          onSave={() => {
            fetchRoles()
            setShowModal(false)
            setSelectedRole(null)
          }}
        />
      )}
    </div>
  )
}

// Modal Component
function RoleModal({ 
  role, 
  permissions,
  onClose, 
  onSave 
}: { 
  role: Role | null,
  permissions: Permission[],
  onClose: () => void, 
  onSave: () => void 
}) {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permission_ids: role?.permissions?.map(p => p.id) || []
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const url = role ? `/api/admin/roles/${role.id}` : '/api/admin/roles'
      const method = role ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSave()
      } else {
        const error = await response.json()
        alert(error.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('خطأ في حفظ الدور:', error)
      alert('حدث خطأ في حفظ الدور')
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter(id => id !== permissionId)
        : [...prev.permission_ids, permissionId]
    }))
  }

  // تجميع الصلاحيات حسب الفئة
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {role ? 'تعديل دور' : 'إضافة دور جديد'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              اسم الدور
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              disabled={role?.is_system}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              الصلاحيات
            </label>
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    {category === 'users' ? 'المستخدمون' :
                     category === 'articles' ? 'المقالات' :
                     category === 'categories' ? 'التصنيفات' :
                     category === 'roles' ? 'الأدوار' :
                     category === 'system' ? 'النظام' : category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {categoryPermissions.map(permission => (
                      <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permission_ids.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {permission.name}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-l from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 