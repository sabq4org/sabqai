import ClientLayout from '@/components/website/ClientLayout'
import HeroSection from '@/components/website/HeroSection'
import NewsCard from '@/components/website/NewsCard'
import CategorySection, { CategoriesGrid } from '@/components/website/CategorySection'
import { ChevronLeftIcon, FireIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/public/categories`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch categories')
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getArticles(params?: any) {
  try {
    const queryParams = new URLSearchParams(params)
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/public/articles?${queryParams}`, {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch articles')
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

export default async function HomePage() {
  // Fetch data
  const [categories, featuredArticle, latestArticles, popularArticles] = await Promise.all([
    getCategories(),
    getArticles({ featured: true, limit: 1 }),
    getArticles({ limit: 8 }),
    getArticles({ popular: true, limit: 5 })
  ])

  // Get articles by category (only for first 3 categories)
  const categoriesWithArticles = await Promise.all(
    categories.slice(0, 3).map(async (category: any) => {
      const articles = await getArticles({ category: category.slug, limit: 4 })
      return { ...category, articles }
    })
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClientLayout>
        <main>
          {/* Hero Section */}
          <HeroSection featuredArticle={featuredArticle[0]} />

          {/* Latest News Section */}
          <section className="py-12 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FireIcon className="h-6 w-6 text-red-500" />
                  آخر الأخبار
                </h2>
                <Link 
                  href="/news"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  عرض الكل
                  <ChevronLeftIcon className="h-4 w-4" />
                </Link>
              </div>
              
              {latestArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {latestArticles.map((article: any) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    لا توجد أخبار حالياً
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Most Popular Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <ChartBarIcon className="h-6 w-6 text-yellow-500" />
                  الأكثر قراءة
                </h2>
              </div>
              
              {popularArticles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="space-y-4">
                    {popularArticles.map((article: any, index: number) => (
                      <div key={article.id} className="flex items-start gap-4">
                        <span className="text-3xl font-bold text-gray-300 dark:text-gray-600 w-8">
                          {index + 1}
                        </span>
                        <NewsCard article={article} variant="compact" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Categories Sections */}
          {categoriesWithArticles.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              articles={category.articles}
            />
          ))}

          {/* All Categories Grid */}
          {categories.length > 0 && (
            <CategoriesGrid categories={categories} />
          )}
        </main>
      </ClientLayout>
    </div>
  )
}
