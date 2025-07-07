'use client'
import { useState } from 'react'
import Link from 'next/link'
import { TagIcon, XMarkIcon, BookOpenIcon, CalendarIcon, ClockIcon, UserIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/components/ThemeProvider'

interface Category {
  id: string
  name: string
  name_ar?: string
  slug: string
  color?: string
  icon?: string
  articleCount?: number
  articles_count?: number
  is_personalized?: boolean
}

interface Article {
  id: string
  title: string
  summary?: string
  excerpt?: string
  featured_image?: string
  featuredImage?: string
  category: {
    name: string
    color?: string
    slug: string
  }
  created_at?: string
  publishedAt?: string
  reading_time?: number
  author_name?: string
  views_count?: number
  viewCount?: number
  commentCount?: number
  likeCount?: number
  isAI?: boolean
}

interface InteractiveCategoriesSectionProps {
  categories: Category[]
  initialArticles?: Article[]
  isLoggedIn?: boolean
}

// أيقونات التصنيفات (نفس المشروع القديم)
const categoryIcons: { [key: string]: string } = {
  'تقنية': '💻',
  'رياضة': '⚽',  
  'اقتصاد': '💰',
  'سياسة': '🏛️',
  'صحة': '🏥',
  'بيئة': '🌿',
  'ثقافة': '📚',
  'محلي': '🏠',
  'محليات': '🗺️',
  'دولي': '🌍',
  'منوعات': '🎉',
  'علوم': '🔬',
  'فن': '🎨',
  'سيارات': '🚗',
  'سياحة': '✈️',
  'تعليم': '🎓',
  'أعمال': '💼',
  'طقس': '☁️',
  'ثقافة ومجتمع': '🎭',
  'مقالات رأي': '✍️',
  'default': '📰'
}

export default function InteractiveCategoriesSection({ categories, initialArticles = [], isLoggedIn = false }: InteractiveCategoriesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([])
  const [categoryArticlesLoading, setCategoryArticlesLoading] = useState(false)
  const [categoriesLoading] = useState(false)
  const { theme } = useTheme()
  const darkMode = theme === 'dark'

  const handleCategoryClick = async (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setCategoryArticles([])
    } else {
      setSelectedCategory(categoryId)
      setCategoryArticlesLoading(true)
      
      try {
        const category = categories.find(c => c.id === categoryId)
        const res = await fetch(`/api/public/articles?category=${category?.slug}&limit=8`)
        if (res.ok) {
          const data = await res.json()
          setCategoryArticles(data.data || [])
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setCategoryArticlesLoading(false)
      }
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div 
        className={`rounded-3xl p-4 sm:p-6 lg:p-8 transition-all duration-500 shadow-lg dark:shadow-gray-900/50 ${darkMode ? 'bg-blue-900/10 border border-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20/50 border border-blue-200/50'}`} 
        style={{ 
          backdropFilter: 'blur(10px)',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)' 
            : 'linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(191, 219, 254, 0.3) 100%)'
        }}>
        <div className="text-center mb-6 sm:mb-8">
          {/* أيقونة كبيرة وواضحة */}
          <div className="mb-4">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center shadow-xl ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-600 to-blue-800' 
                : 'bg-gradient-to-br from-blue-500 to-blue-700'
            }`}>
              <TagIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          
          {/* العنوان */}
          <h2 className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-800 dark:text-gray-100'
          }`}>
            {isLoggedIn ? 'استكشف بحسب اهتماماتك' : 'استكشف بحسب التصنيفات'}
          </h2>
          
          {/* الوصف */}
          <p className={`text-sm transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isLoggedIn 
              ? 'التصنيفات المختارة لك بناءً على تفضيلاتك وتفاعلاتك'
              : 'اختر التصنيف الذي يهمك لتصفح الأخبار المتخصصة'
            }
          </p>
          <div className={`text-xs mt-2 transition-colors duration-300 ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {isLoggedIn ? (
              <div className="flex items-center gap-1 justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="opacity-75">مخصص لك بناءً على تفضيلاتك</span>
              </div>
            ) : (
              <span className="opacity-75">التصنيفات مرتبطة بنظام إدارة المحتوى</span>
            )}
          </div>
        </div>

        {categoriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : categories.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`group px-3 py-2 sm:px-4 md:px-6 sm:py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 relative ${selectedCategory === category.id ? darkMode ? 'bg-blue-600 text-white border-2 border-blue-500 shadow-lg dark:shadow-gray-900/50' : 'bg-blue-500 text-white border-2 border-blue-400 shadow-lg dark:shadow-gray-900/50' : darkMode ? 'bg-blue-800/20 hover:bg-blue-700/30 text-blue-100 hover:text-blue-50 border border-blue-700/30 hover:border-blue-600/50' : 'bg-white dark:bg-gray-800/80 hover:bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 border border-blue-200/50 hover:border-blue-300 shadow-sm dark:shadow-gray-900/50 hover:shadow-lg dark:shadow-gray-900/50 backdrop-blur-sm'}`}
                >
                  {/* شارة "مخصص" للتصنيفات المخصصة */}
                  {isLoggedIn && category.is_personalized && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
                  )}
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300">
                      {category.icon || categoryIcons[category.name_ar || category.name] || categoryIcons['default'] || '📰'}
                    </span>
                    <span className="whitespace-nowrap">{category.name_ar || category.name}</span>
                    <span className={`text-xs ${selectedCategory === category.id ? 'text-white/90' : darkMode ? 'text-blue-200 opacity-60' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500 opacity-60'}`}>
                      ({category.articles_count || category.articleCount || 0})
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* عرض المقالات المرتبطة بالتصنيف المختار */}
            {selectedCategory && (
              <div className={`mt-8 p-6 rounded-3xl shadow-lg dark:shadow-gray-900/50 ${darkMode ? 'bg-gray-800/50' : 'bg-white dark:bg-gray-800/70'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    مقالات {categories.find(c => c.id === selectedCategory)?.name_ar || categories.find(c => c.id === selectedCategory)?.name}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCategoryArticles([]);
                    }}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800'}`}
                  >
                    <XMarkIcon className={`w-5 h-5 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400 dark:text-gray-500'}`} />
                  </button>
                </div>

                {categoryArticlesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : categoryArticles.length > 0 ? (
                  <>
                    {/* Grid Layout for Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {categoryArticles.map((article: any) => (
                        <Link key={article.id} href={`/article/${article.id}`} className="group">
                          <article className={`h-full rounded-3xl overflow-hidden shadow-xl dark:shadow-gray-900/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
                            {/* صورة المقال */}
                            <div className="relative h-40 sm:h-48 overflow-hidden">
                              {article.featured_image || article.featuredImage ? (
                                <img
                                  src={article.featured_image || article.featuredImage}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                  <BookOpenIcon className={`w-12 h-12 sm:w-16 sm:h-16 ${darkMode ? 'text-gray-600 dark:text-gray-400 dark:text-gray-500' : 'text-gray-300'}`} />
                                </div>
                              )}
                              
                              {/* تأثير التدرج على الصورة */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Category Badge */}
                              <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-blue-900/80 text-blue-200 backdrop-blur-sm' : 'bg-blue-500/90 text-white backdrop-blur-sm'}`}>
                                  <TagIcon className="w-2 h-2 sm:w-3 sm:h-3" />
                                  {categories.find(c => c.id === selectedCategory)?.name_ar || categories.find(c => c.id === selectedCategory)?.name}
                                </span>
                              </div>
                            </div>

                            {/* محتوى البطاقة */}
                            <div className="p-4 sm:p-5">
                              {/* العنوان */}
                              <h4 className={`font-bold text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                {article.title}
                              </h4>

                              {/* الملخص */}
                              {(article.summary || article.excerpt) && (
                                <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 text-gray-600 dark:text-gray-400 dark:text-gray-500`}>
                                  {article.summary || article.excerpt}
                                </p>
                              )}

                              {/* التفاصيل السفلية */}
                              <div className={`flex items-center justify-between pt-3 sm:pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100 dark:border-gray-700'}`}>
                                {/* المعلومات */}
                                <div className="flex flex-col gap-1">
                                  {/* التاريخ والوقت */}
                                  <div className="flex items-center gap-2 sm:gap-3 text-xs">
                                    <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                                      <CalendarIcon className="w-3 h-3" />
                                      {new Date(article.created_at || article.publishedAt).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      })}
                                    </span>
                                    {article.reading_time && (
                                      <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                                        <ClockIcon className="w-3 h-3" />
                                        {article.reading_time} د
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* الكاتب والمشاهدات */}
                                  <div className="flex items-center gap-2 sm:gap-3 text-xs">
                                    {article.author_name && (
                                      <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                                        <UserIcon className="w-3 h-3" />
                                        {article.author_name}
                                      </span>
                                    )}
                                    <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                                      <EyeIcon className="w-3 h-3" />
                                      {article.views_count || article.viewCount || 0}
                                    </span>
                                  </div>
                                </div>

                                {/* زر القراءة */}
                                <div className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-blue-900/20 group-hover:bg-blue-800/30' : 'bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100'}`}>
                                  <ArrowLeftIcon className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                </div>
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                    
                    {/* زر عرض جميع المقالات */}
                    <div className="text-center mt-8">
                      <Link 
                        href={`/categories/${categories.find(c => c.id === selectedCategory)?.slug || categories.find(c => c.id === selectedCategory)?.name_ar?.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:shadow-gray-900/50 ${darkMode ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'}`}>
                        <span>عرض جميع مقالات {categories.find(c => c.id === selectedCategory)?.name_ar || categories.find(c => c.id === selectedCategory)?.name}</span>
                        <ArrowLeftIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </>
                  
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
                    <BookOpenIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد مقالات منشورة في هذا التصنيف حالياً</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400 dark:text-gray-500'}`}>
            <p className="text-sm">لا توجد تصنيفات متاحة حالياً</p>
          </div>
        )}
      </div>
    </section>
  )
} 