'use client'

import { useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'
import CategoriesSectionExact from './CategoriesSectionExact'

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
}

interface CategoriesSectionWrapperProps {
  categories: Category[]
  initialArticles?: Article[]
}

export default function CategoriesSectionWrapper({ categories, initialArticles = [] }: CategoriesSectionWrapperProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categoryArticles, setCategoryArticles] = useState<Article[]>([])
  const [categoryArticlesLoading, setCategoryArticlesLoading] = useState(false)
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
          const articles = data.data || []
          // تحويل البيانات لتطابق المشروع القديم
          const mappedArticles = articles.map((article: any) => ({
            ...article,
            featured_image: article.featuredImage || article.featured_image,
            created_at: article.publishedAt || article.created_at,
            views_count: article.viewCount || article.views_count || 0,
            reading_time: article.reading_time || 5
          }))
          setCategoryArticles(mappedArticles)
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setCategoryArticlesLoading(false)
      }
    }
  }

  // تحويل البيانات لتطابق المشروع القديم
  const mappedCategories = categories.map(category => ({
    ...category,
    name_ar: category.name,
    articles_count: category.articleCount || 0
  }))

  return (
    <CategoriesSectionExact
      categories={mappedCategories}
      isLoggedIn={false}
      darkMode={darkMode}
      handleCategoryClick={handleCategoryClick}
      selectedCategory={selectedCategory}
      categoryArticles={categoryArticles}
      categoriesLoading={false}
      categoryArticlesLoading={categoryArticlesLoading}
      setCategoryArticles={setCategoryArticles}
      setSelectedCategory={setSelectedCategory}
    />
  )
} 