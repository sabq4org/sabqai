'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import ar from 'date-fns/locale/ar-SA'

interface ActivityLog {
  id: string
  action: string
  resource?: string
  resourceId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

const actionLabels: { [key: string]: string } = {
  login: 'تسجيل دخول',
  logout: 'تسجيل خروج',
  register: 'تسجيل حساب جديد',
  forgot_password: 'طلب إعادة تعيين كلمة المرور',
  reset_password: 'إعادة تعيين كلمة المرور',
  update_profile: 'تحديث الملف الشخصي',
  update_user: 'تحديث مستخدم',
  delete_user: 'حذف مستخدم',
  create_article: 'إنشاء مقال',
  update_article: 'تحديث مقال',
  delete_article: 'حذف مقال',
  change_role: 'تغيير صلاحيات',
  unauthorized_access: 'محاولة وصول غير مصرح',
  error: 'خطأ'
}

const actionColors: { [key: string]: string } = {
  login: 'bg-green-100 text-green-800',
  logout: 'bg-gray-100 text-gray-800',
  register: 'bg-blue-100 text-blue-800',
  forgot_password: 'bg-yellow-100 text-yellow-800',
  reset_password: 'bg-yellow-100 text-yellow-800',
  update_profile: 'bg-purple-100 text-purple-800',
  update_user: 'bg-purple-100 text-purple-800',
  delete_user: 'bg-red-100 text-red-800',
  create_article: 'bg-green-100 text-green-800',
  update_article: 'bg-purple-100 text-purple-800',
  delete_article: 'bg-red-100 text-red-800',
  change_role: 'bg-orange-100 text-orange-800',
  unauthorized_access: 'bg-red-100 text-red-800',
  error: 'bg-red-100 text-red-800'
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState('')
  const limit = 50

  useEffect(() => {
    fetchLogs()
  }, [page, filter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString()
      })
      
      if (filter) {
        params.append('action', filter)
      }

      const response = await fetch(`/api/admin/activity-logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy - HH:mm', { locale: ar })
    } catch {
      return dateString
    }
  }

  const getActionLabel = (action: string) => {
    return actionLabels[action] || action
  }

  const getActionColor = (action: string) => {
    return actionColors[action] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          سجل الأنشطة
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          مراقبة جميع الأنشطة في النظام
        </p>
      </div>

      {/* فلتر الأنشطة */}
      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value)
            setPage(0)
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">جميع الأنشطة</option>
          {Object.entries(actionLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* جدول السجلات */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            لا توجد سجلات
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    النشاط
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    التفاصيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.user ? (
                        <div>
                          <div className="text-gray-900 dark:text-white">{log.user.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {log.details && (
                        <div className="max-w-xs overflow-hidden text-ellipsis">
                          {typeof log.details === 'object' ? (
                            <pre className="text-xs">{JSON.stringify(log.details, null, 2)}</pre>
                          ) : (
                            log.details
                          )}
                        </div>
                      )}
                      {log.resource && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {log.resource} {log.resourceId && `#${log.resourceId}`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.ipAddress || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* التنقل بين الصفحات */}
      {total > limit && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            عرض {page * limit + 1} إلى {Math.min((page + 1) * limit, total)} من {total} سجل
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * limit >= total}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 