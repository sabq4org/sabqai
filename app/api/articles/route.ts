import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// جلب جميع المقالات مع فلترة وبحث
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const authorId = searchParams.get('authorId')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'

    const skip = (page - 1) * limit

    // بناء شروط الفلترة
    const where: any = {}
    
    if (status !== 'all') {
      where.status = status
    }
    
    if (authorId) {
      where.authorId = authorId
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    // جلب المقالات
    const [articles, total] = await Promise.all([
      prisma.sabq_articles.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              color: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              views: true
            }
          }
        }
      }),
      prisma.sabq_articles.count({ where })
    ])

    // إحصائيات سريعة
    const stats = await prisma.sabq_articles.groupBy({
      by: ['status'],
      _count: true
    })

    const todayCount = await prisma.sabq_articles.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    })

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        byStatus: stats.reduce((acc: Record<string, number>, curr) => {
          acc[curr.status] = curr._count
          return acc
        }, {}),
        todayCount
      }
    })
  } catch (error) {
    console.error('خطأ في جلب المقالات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المقالات' },
      { status: 500 }
    )
  }
}

// إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'رمز غير صالح' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { title, content, excerpt, categoryId, tags, featuredImage, status = 'draft' } = data

    const article = await prisma.sabq_articles.create({
      data: {
        title,
        content,
        excerpt,
        categoryId,
        authorId: decoded.userId,
        tags: tags || [],
        featuredImage,
        status,
        slug: generateSlug(title),
        publishedAt: status === 'published' ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('خطأ في إنشاء المقال:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المقال' },
      { status: 500 }
    )
  }
}

// عمليات جماعية
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'رمز غير صالح' },
        { status: 401 }
      )
    }

    const { action, articleIds, data } = await request.json()

    switch (action) {
      case 'publish':
        await prisma.sabq_articles.updateMany({
          where: { id: { in: articleIds } },
          data: { 
            status: 'published',
            publishedAt: new Date()
          }
        })
        break

      case 'archive':
        await prisma.sabq_articles.updateMany({
          where: { id: { in: articleIds } },
          data: { status: 'archived' }
        })
        break

      case 'delete':
        await prisma.sabq_articles.updateMany({
          where: { id: { in: articleIds } },
          data: { status: 'deleted' }
        })
        break

      case 'changeCategory':
        await prisma.sabq_articles.updateMany({
          where: { id: { in: articleIds } },
          data: { categoryId: data.categoryId }
        })
        break

      case 'pin':
        await prisma.sabq_articles.updateMany({
          where: { id: { in: articleIds } },
          data: { isPinned: true }
        })
        break

      case 'unpin':
        await prisma.sabq_articles.updateMany({
          where: { id: { in: articleIds } },
          data: { isPinned: false }
        })
        break

      default:
        return NextResponse.json(
          { error: 'إجراء غير صالح' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true, 
      message: `تم تنفيذ العملية على ${articleIds.length} مقال` 
    })
  } catch (error) {
    console.error('خطأ في العملية الجماعية:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تنفيذ العملية' },
      { status: 500 }
    )
  }
}

// دالة مساعدة لتوليد slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
} 