'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NewsCard from './NewsCard'
import { ChevronRightIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline'

interface Category {
  id: string
  name: string
  slug: string
  color?: string
  icon?: string
  articleCount?: number
}

interface Article {
  id: string
  title: string
  excerpt?: string
  featuredImage?: string
  category: {
    name: string
    color?: string
    slug: string
  }
  publishedAt: string
  viewCount: number
  commentCount?: number
  likeCount?: number
  isAI?: boolean
}

interface InteractiveCategoriesSectionProps {
  categories: Category[]
  initialArticles?: Article[]
}

export default function InteractiveCategoriesSection({ categories, initialArticles = [] }: InteractiveCategoriesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [loading, setLoading] = useState(false)

  const categoryIcons: { [key: string]: string } = {
    'تقنية': '💻',
    'رياضة': '⚽',
    'اقتصاد': '💰',
    'سياسة': '🏛️',
    'محليات': '🗺️',
    'ثقافة ومجتمع': '🎭',
    'مقالات رأي': '✍️',
    'منوعات': '🎉',
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryArticles(selectedCategory)
    }
  }, [selectedCategory])

  const fetchCategoryArticles = async (categorySlug: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/public/articles?category=${categorySlug}&limit=8`)
      if (res.ok) {
        const data = await res.json()
        setArticles(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory(null)
      setArticles(initialArticles)
    } else {
      setSelectedCategory(slug)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div 
        className="rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-500 shadow-lg dark:shadow-gray-900/50 bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30"
        style={{ 
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(191, 219, 254, 0.3) 100%)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          {/* أيقونة كبيرة وواضحة */}
          <div className="mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br from-blue-500 to-blue-700">
              <TagIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          
          {/* العنوان */}
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800 dark:text-white">
            استكشف بحسب التصنيفات
          </h2>
          
          {/* الوصف */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            اختر التصنيف الذي يهمك لتصفح الأخبار المتخصصة
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`
                group px-3 py-2 sm:px-4 md:px-6 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 relative
                ${selectedCategory === category.slug 
                  ? 'bg-blue-500 text-white border-2 border-blue-400 shadow-lg' 
                  : 'bg-white dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-blue-200/50 dark:border-gray-700/30 hover:border-blue-300 shadow-sm hover:shadow-lg backdrop-blur-sm'
                }
              `}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300">
                  {category.icon || categoryIcons[category.name] || '📰'}
                </span>
                <span className="whitespace-nowrap">{category.name}</span>
                <span className={`text-xs ${selectedCategory === category.slug ? 'text-white/90' : 'text-gray-500 dark:text-gray-400 opacity-60'}`}>
                  ({category.articleCount || 0})
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* عرض المقالات المرتبطة بالتصنيف المختار */}
        {selectedCategory && (
          <div className="mt-8 p-6 rounded-3xl shadow-lg bg-white dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                مقالات {categories.find(c => c.slug === selectedCategory)?.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory(null)
                  setArticles([])
                }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : articles.length > 0 ? (
              <>
                {/* Grid Layout for Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {articles.slice(0, 8).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
                
                {/* زر عرض جميع المقالات */}
                <div className="text-center mt-8">
                  <Link 
                    href={`/category/${selectedCategory}`}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  >
                    <span>عرض جميع مقالات {categories.find(c => c.slug === selectedCategory)?.name}</span>
                    <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>لا توجد مقالات منشورة في هذا التصنيف حالياً</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
} 