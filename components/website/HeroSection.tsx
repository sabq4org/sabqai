'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { useClientDate } from '@/hooks/useClientDate'

interface HeroArticle {
  id: string
  title: string
  excerpt: string
  featuredImage?: string
  category: { name: string; color?: string }
  publishedAt: string
  viewCount: number
  isAI?: boolean
}

interface HeroSectionProps {
  featuredArticle?: HeroArticle
}

export default function HeroSection({ featuredArticle }: HeroSectionProps) {
  const { formatDateTime, formatNumber } = useClientDate()
  
  // Default featured article for demonstration
  const defaultArticle: HeroArticle = {
    id: '1',
    title: 'المملكة تستضيف قمة الذكاء الاصطناعي العالمية 2025',
    excerpt: 'تستعد المملكة العربية السعودية لاستضافة أكبر حدث عالمي للذكاء الاصطناعي في الشرق الأوسط، بمشاركة أبرز الخبراء والشركات العالمية في مجال التقنية والابتكار.',
    featuredImage: '/api/placeholder/800/400',
    category: { name: 'تقنية', color: 'bg-blue-600' },
    publishedAt: '2025-01-07T12:00:00Z',
    viewCount: 1250,
    isAI: true
  }

  const article = featuredArticle || defaultArticle

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            كل جديد... يوصلك أول بأول من{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
              سبق الذكية
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
            أخبار اليوم بنكهة الذكاء الاصطناعي
            <SparklesIcon className="h-6 w-6 text-yellow-500" />
          </p>
        </div>

        {/* Featured Article */}
        <div className="relative group">
          <Link href={`/article/${article.id}`}>
            <div className="overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-800">
              {/* Image */}
              <div className="relative h-96 bg-gray-200 dark:bg-gray-700">
                {article.featuredImage && (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${article.category.color || 'bg-blue-600'}`}>
                    {article.category.name}
                  </span>
                </div>

                {/* AI Badge */}
                {article.isAI && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-black">
                      <SparklesIcon className="h-4 w-4 ml-1" />
                      محتوى ذكي
                    </span>
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-0 right-0 left-0 p-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-gray-300 text-sm">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {formatDateTime(article.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {formatNumber(article.viewCount)} مشاهدة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            href="/live"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <span className="relative flex h-3 w-3 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            شاهد البث الحي
          </Link>
          
          <Link
            href="/breaking"
            className="inline-flex items-center px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
          >
            التغطية العاجلة
          </Link>
          
          <Link
            href="/ai-tour"
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <SparklesIcon className="h-5 w-5 ml-2" />
            ابدأ الجولة الذكية
          </Link>
        </div>
      </div>
    </section>
  )
} 