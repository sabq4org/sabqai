import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categorySlug = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const featured = searchParams.get('featured') === 'true'
    const popular = searchParams.get('popular') === 'true'

    const whereClause: any = {
      status: 'published',
      publishedAt: {
        lte: new Date()
      }
    }

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
        is_active: true
      }
    }

    if (featured) {
      whereClause.isPinned = true
    }

    const orderBy: any = popular 
      ? { viewCount: 'desc' }
      : { publishedAt: 'desc' }

    const articles = await prisma.sabq_articles.findMany({
      where: whereClause,
      take: limit,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true
          }
        },
        author: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      }
    })

    // Transform the data
    const transformedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage,
      category: article.category,
      author: article.author,
      publishedAt: article.publishedAt?.toISOString() || '',
      viewCount: article.viewCount,
      commentCount: article._count.comments,
      likeCount: article._count.likes,
      isAI: article.tags?.includes('ai-generated') || false
    }))

    return NextResponse.json({
      success: true,
      data: transformedArticles
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 