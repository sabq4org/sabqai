'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ArchiveBoxIcon,
  BookmarkIcon,
  ChartBarIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  slug: string
  excerpt?: string
  status: string
  isPinned: boolean
  viewCount: number
  author: {
    id: string
    name: string
    email: string
  }
  category: {
    id: string
    name: string
    color: string
  }
  _count: {
    comments: number
    likes: number
    views: number
  }
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  byStatus: Record<string, number>
  todayCount: number
}

export default function ArticlesDashboard() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [stats, setStats] = useState<Stats>({
    byStatus: {},
    todayCount: 0
  })
  const [filters, setFilters] = useState({
    status: 'all',
    categoryId: '',
    authorId: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [authors, setAuthors] = useState<any[]>([])
  const router = useRouter()

  // جلب المقالات
  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      })

      const response = await fetch(`/api/articles?${params}`)
      const data = await response.json()

      if (response.ok) {
        setArticles(data.articles)
        setPagination(data.pagination)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('خطأ في جلب المقالات:', error)
    } finally {
      setLoading(false)
    }
  }

  // جلب التصنيفات والكتاب
  const fetchFiltersData = async () => {
    try {
      const [categoriesRes, usersRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/admin/users')
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setAuthors(usersData.filter((user: any) => 
          user.role?.name === 'author' || user.role?.name === 'editor'
        ))
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات الفلترة:', error)
    }
  }

  useEffect(() => {
    fetchArticles()
    fetchFiltersData()
  }, [pagination.page, filters])

  // تحديد/إلغاء تحديد مقال
  const toggleArticleSelection = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  // تحديد الكل
  const selectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([])
    } else {
      setSelectedArticles(articles.map(a => a.id))
    }
  }

  // عمليات جماعية
  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedArticles.length === 0) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/articles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          articleIds: selectedArticles,
          data
        })
      })

      if (response.ok) {
        setSelectedArticles([])
        fetchArticles()
      }
    } catch (error) {
      console.error('خطأ في العملية الجماعية:', error)
    }
  }

  // حذف مقال
  const deleteArticle = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error('خطأ في حذف المقال:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'مسودة', color: 'bg-gray-100 text-gray-800' },
      published: { label: 'منشور', color: 'bg-green-100 text-green-800' },
      archived: { label: 'مؤرشف', color: 'bg-yellow-100 text-yellow-800' },
      deleted: { label: 'محذوف', color: 'bg-red-100 text-red-800' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  if (loading && articles.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900">إدارة المقالات</h1>
            <p className="text-sm text-gray-500 mt-1">
              إدارة جميع المقالات المنشورة والمسودات
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard/articles/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            مقال جديد
          </button>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="text-sm">إجمالي المقالات</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(stats.byStatus).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckIcon className="w-5 h-5" />
              <span className="text-sm">منشورة</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {stats.byStatus.published || 0}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <DocumentTextIcon className="w-5 h-5" />
              <span className="text-sm">مسودات</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.byStatus.draft || 0}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <ArchiveBoxIcon className="w-5 h-5" />
              <span className="text-sm">مؤرشفة</span>
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {stats.byStatus.archived || 0}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ChartBarIcon className="w-5 h-5" />
              <span className="text-sm">مقالات اليوم</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {stats.todayCount}
            </p>
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
                placeholder="ابحث في المقالات..."
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

          {/* العمليات الجماعية */}
          {selectedArticles.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedArticles.length} مقال محدد
              </span>
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                نشر
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                أرشفة
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                حذف
              </button>
            </div>
          )}
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="archived">مؤرشف</option>
              <option value="deleted">محذوف</option>
            </select>

            <select
              value={filters.categoryId}
              onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">جميع التصنيفات</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <select
              value={filters.authorId}
              onChange={(e) => setFilters({ ...filters, authorId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">جميع الكتاب</option>
              {authors.map(author => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
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
              <option value="viewCount-desc">الأكثر مشاهدة</option>
              <option value="title-asc">العنوان (أ-ي)</option>
            </select>
          </div>
        )}
      </div>

      {/* جدول المقالات */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length && articles.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العنوان
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الكاتب
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  التصنيف
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  الإحصائيات
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  التاريخ
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => toggleArticleSelection(article.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{article.title}</p>
                        {article.isPinned && (
                          <BookmarkIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900">{article.author.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span 
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: `${article.category.color}20`,
                        color: article.category.color 
                      }}
                    >
                      {article.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(article.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        {article.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {article._count.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        ❤️ {article._count.likes}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-500">
                      {format(new Date(article.createdAt), 'dd MMM yyyy', { locale: ar })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => window.open(`/article/${article.id}`, '_blank')}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="عرض"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}
                        className="p-1 text-gray-600 hover:text-green-600"
                        title="تعديل"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
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

        {/* التصفح */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                عرض {((pagination.page - 1) * pagination.limit) + 1} إلى{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} من{' '}
                {pagination.total} مقال
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="text-sm">
                  صفحة {pagination.page} من {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 