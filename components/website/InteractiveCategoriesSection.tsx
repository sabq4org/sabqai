'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NewsCard from './NewsCard'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/40 dark:from-gray-800/90 dark:to-gray-900/90 rounded-3xl p-6 md:p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              تصفح الأخبار حسب اهتمامك
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              اختر القسم لعرض آخر الأخبار
            </p>
          </div>
          
          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`
                  group relative overflow-hidden rounded-xl p-3 transition-all duration-200
                  ${selectedCategory === category.slug 
                    ? 'bg-white dark:bg-gray-700 shadow-lg ring-2 ring-blue-500' 
                    : 'bg-white/60 dark:bg-gray-700/60 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">
                    {category.icon || categoryIcons[category.name] || '📰'}
                  </span>
                  <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  {category.articleCount !== undefined && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {category.articleCount}
                    </span>
                  )}
                </div>
                
                {/* Active indicator */}
                {selectedCategory === category.slug && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
                )}
              </button>
            ))}
          </div>

          {/* Articles */}
          {selectedCategory && (
            <div className="border-t border-blue-200/50 dark:border-gray-700/50 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  آخر أخبار {categories.find(c => c.slug === selectedCategory)?.name}
                </h3>
                <Link 
                  href={`/category/${selectedCategory}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                >
                  عرض الكل
                  <ChevronRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {articles.slice(0, 8).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    لا توجد أخبار في هذا القسم حالياً
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 