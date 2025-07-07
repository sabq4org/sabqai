'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ClockIcon, EyeIcon, ChatBubbleLeftIcon, HeartIcon } from '@heroicons/react/24/outline'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { useClientDate } from '@/hooks/useClientDate'

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
  author?: {
    name: string
  }
  publishedAt: string
  viewCount: number
  commentCount?: number
  likeCount?: number
  isAI?: boolean
}

interface NewsCardProps {
  article: Article
  variant?: 'default' | 'compact' | 'featured'
}

export default function NewsCard({ article, variant = 'default' }: NewsCardProps) {
  const { formatDate, formatNumber } = useClientDate()

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.id}`} className="group block">
        <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          {/* Thumbnail */}
          {article.featuredImage && (
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-2">
              {article.title}
            </h3>
            
            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                style={{ backgroundColor: article.category.color || '#3B82F6', color: 'white' }}>
                {article.category.name}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon className="h-3.5 w-3.5" />
                {formatNumber(article.viewCount)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/article/${article.id}`} className="group block h-full">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          {article.featuredImage && (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: article.category.color || '#3B82F6' }}>
              {article.category.name}
            </span>
          </div>
          
          {/* AI Badge */}
          {article.isAI && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-black">
                <SparklesIcon className="h-3 w-3 ml-1" />
                ذكي
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          {article.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
              {article.excerpt}
            </p>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
            {/* Time and Views */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                {formatNumber(article.viewCount)}
              </span>
            </div>
            
            {/* Interactions */}
            <div className="flex items-center gap-3">
              {article.commentCount !== undefined && (
                <span className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  {article.commentCount}
                </span>
              )}
              {article.likeCount !== undefined && (
                <span className="flex items-center gap-1">
                  <HeartIcon className="h-4 w-4" />
                  {article.likeCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
} 