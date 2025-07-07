'use client'

import { useEffect, useState } from 'react'

export function useClientDate() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (date: string) => {
    if (!mounted) {
      // عرض نص مؤقت أثناء SSR
      return '...'
    }

    const now = new Date()
    const articleDate = new Date(date)
    const diffInHours = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'منذ دقائق'
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`
    } else {
      return articleDate.toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' })
    }
  }

  const formatDateTime = (date: string) => {
    if (!mounted) {
      return '...'
    }

    return new Date(date).toLocaleDateString('ar-SA', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (!mounted) {
      return num.toString()
    }
    return num.toLocaleString('ar-SA')
  }

  return {
    mounted,
    formatDate,
    formatDateTime,
    formatNumber
  }
} 