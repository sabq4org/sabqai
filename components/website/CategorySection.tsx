'use client'
import Link from 'next/link'
import NewsCard from './NewsCard'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

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

interface CategorySectionProps {
  category: Category
  articles: Article[]
  showMore?: boolean
}

export default function CategorySection({ category, articles, showMore = true }: CategorySectionProps) {
  // Category Icons mapping
  const categoryIcons: { [key: string]: string } = {
    'محلي': '🏛️',
    'اقتصاد': '💰',
    'رياضة': '⚽',
    'تقنية': '💻',
    'ثقافة': '🎭',
    'صحة': '🏥',
    'تعليم': '📚',
    'سياحة': '✈️',
    'سيارات': '🚗',
    'أسواق': '📊',
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Category Icon */}
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: category.color || '#3B82F6' }}
            >
              <span className="filter grayscale-0 brightness-0 invert">
                {category.icon || categoryIcons[category.name] || '📰'}
              </span>
            </div>
            
            {/* Category Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h2>
              {category.articleCount !== undefined && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.articleCount} مقال
                </p>
              )}
            </div>
          </div>
          
          {/* View All Link */}
          {showMore && (
            <Link 
              href={`/category/${category.slug}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              عرض الكل
              <ChevronLeftIcon className="h-4 w-4" />
            </Link>
          )}
        </div>
        
        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد مقالات في هذا القسم حالياً
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

// Categories Grid Component
interface CategoriesGridProps {
  categories: Category[]
}

export function CategoriesGrid({ categories }: CategoriesGridProps) {
  const categoryIcons: { [key: string]: string } = {
    'محلي': '🏛️',
    'اقتصاد': '💰',
    'رياضة': '⚽',
    'تقنية': '💻',
    'ثقافة': '🎭',
    'صحة': '🏥',
    'تعليم': '📚',
    'سياحة': '✈️',
    'سيارات': '🚗',
    'أسواق': '📊',
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          تصفح الأقسام
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3"
                  style={{ backgroundColor: category.color || '#3B82F6' }}
                >
                  <span className="filter grayscale-0 brightness-0 invert">
                    {category.icon || categoryIcons[category.name] || '📰'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {category.name}
                </h3>
                {category.articleCount !== undefined && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {category.articleCount} مقال
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 