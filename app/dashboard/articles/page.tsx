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
  author: {
    name: string
  }
  category: {
    name: string
    color: string
  }
  status: 'published' | 'draft' | 'archived'
  views: number
  created_at: string
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
      const response = await fetch('/api/articles', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // بيانات تجريبية
        setArticles([
          {
            id: '1',
            title: 'تطورات جديدة في عالم الذكاء الاصطناعي',
            slug: 'ai-developments',
            author: { name: 'أحمد محمد' },
            category: { name: 'تقنية', color: '#8B5CF6' },
            status: 'published',
            views: 1234,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'نتائج مباراة الهلال والنصر',
            slug: 'match-results',
            author: { name: 'سارة أحمد' },
            category: { name: 'رياضة', color: '#F59E0B' },
            status: 'published',
            views: 5678,
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'تحليل اقتصادي للربع الأول',
            slug: 'economic-analysis',
            author: { name: 'محمد علي' },
            category: { name: 'اقتصاد', color: '#10B981' },
            status: 'draft',
            views: 890,
            created_at: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('خطأ في جلب المقالات:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (articleId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return
    // حذف المقال
    fetchArticles()
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
      key: 'author', 
      label: 'الكاتب',
      render: (value: any, article: Article) => article.author.name
    },
    { 
      key: 'category', 
      label: 'التصنيف',
      render: (value: any, article: Article) => (
        <span 
          className="px-2 py-1 text-xs rounded-full text-white"
          style={{ backgroundColor: article.category.color }}
        >
          {article.category.name}
        </span>
      )
    },
    { 
      key: 'views', 
      label: 'المشاهدات',
      render: (value: any, article: Article) => article.views.toLocaleString('ar-SA')
    },
    { 
      key: 'status', 
      label: 'الحالة',
      render: (value: any, article: Article) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          article.status === 'published' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : article.status === 'draft'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {article.status === 'published' ? 'منشور' : article.status === 'draft' ? 'مسودة' : 'مؤرشف'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (value: any, article: Article) => (
        <div className="flex gap-2">
          <button
            className="p-1 text-blue-600 hover:bg-blue-50 rounded dark:text-blue-400 dark:hover:bg-blue-900/20"
            title="عرض"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-green-600 hover:bg-green-50 rounded dark:text-green-400 dark:hover:bg-green-900/20"
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
      <div className="p-8">
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
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المقالات</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <PlusIcon className="w-5 h-5" />
          <span>إضافة مقال</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن مقال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </Card>
        
        <Card>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </Card>
      </div>

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