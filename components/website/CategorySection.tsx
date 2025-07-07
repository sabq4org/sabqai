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
    'تقنية': '💻',
    'رياضة': '⚽',
    'اقتصاد': '💰',
    'سياسة': '🏛️',
    'محليات': '🗺️',
    'ثقافة ومجتمع': '🎭',
    'مقالات رأي': '✍️',
    'منوعات': '🎉',
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
    'تقنية': '💻',
    'رياضة': '⚽',
    'اقتصاد': '💰',
    'سياسة': '🏛️',
    'محليات': '🗺️',
    'ثقافة ومجتمع': '🎭',
    'مقالات رأي': '✍️',
    'منوعات': '🎉',
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              تصفح الأخبار حسب اهتمامك
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              اختر القسم المفضل لديك
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <span className="text-2xl">
                      {category.icon || categoryIcons[category.name] || '📰'}
                    </span>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                        {category.name}
                      </h3>
                      {category.articleCount !== undefined && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category.articleCount} مقال
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 