'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline'
import ResponsiveTable from '@/components/dashboard/ResponsiveTable'
import Card from '@/components/dashboard/Card'

interface Article {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  author: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
  }
  views_count: number
  created_at: string
  published_at: string | null
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/articles?limit=100', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
      }
    } catch (error) {
      console.error('خطأ في جلب المقالات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error('خطأ في حذف المقال:', error)
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    { 
      key: 'title', 
      label: 'العنوان',
      render: (value: any, article: Article) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{article.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{article.slug}</div>
        </div>
      )
    },
    { 
      key: 'category', 
      label: 'التصنيف',
      render: (value: any, article: Article) => article.category?.name || 'غير مصنف'
    },
    { 
      key: 'author', 
      label: 'الكاتب',
      render: (value: any, article: Article) => article.author?.name || 'غير محدد'
    },
    { 
      key: 'status', 
      label: 'الحالة',
      render: (value: any, article: Article) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          article.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          article.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {article.status === 'published' ? 'منشور' : 
           article.status === 'draft' ? 'مسودة' : 'مؤرشف'}
        </span>
      )
    },
    { 
      key: 'views_count', 
      label: 'المشاهدات',
      render: (value: any, article: Article) => article.views_count.toLocaleString('ar-SA')
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (value: any, article: Article) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/article/${article.id}`)}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded dark:text-gray-400 dark:hover:bg-gray-900/20"
            title="عرض"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push(`/dashboard/articles/${article.id}/edit`)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20"
            title="تعديل"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(article.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded dark:text-red-400 dark:hover:bg-red-900/20"
            title="حذف"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المقالات</h1>
        <button
          onClick={() => router.push('/dashboard/articles/new')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          <span>إضافة مقال</span>
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن مقال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </Card>

      {/* Articles Table */}
      <Card>
        <ResponsiveTable
          data={filteredArticles}
          columns={columns}
          keyField="id"
          emptyMessage="لا توجد مقالات"
        />
      </Card>
    </div>
  )
} 