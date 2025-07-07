import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// جلب مقال واحد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.sabq_articles.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            views: true
          }
        }
      }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'المقال غير موجود' },
        { status: 404 }
      )
    }

    // زيادة عدد المشاهدات
    await prisma.sabq_articles.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('خطأ في جلب المقال:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المقال' },
      { status: 500 }
    )
  }
}

// تحديث مقال
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updateData: any = {}

    // تحديث الحقول المرسلة فقط
    if (data.title !== undefined) {
      updateData.title = data.title
      updateData.slug = generateSlug(data.title)
    }
    if (data.content !== undefined) updateData.content = data.content
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage
    if (data.status !== undefined) {
      updateData.status = data.status
      if (data.status === 'published' && !data.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }
    if (data.isPinned !== undefined) updateData.isPinned = data.isPinned

    const article = await prisma.sabq_articles.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json(article)
  } catch (error) {
    console.error('خطأ في تحديث المقال:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المقال' },
      { status: 500 }
    )
  }
}

// حذف مقال
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // حذف ناعم - تغيير الحالة إلى deleted
    await prisma.sabq_articles.update({
      where: { id: params.id },
      data: { status: 'deleted' }
    })

    return NextResponse.json({ 
      success: true,
      message: 'تم حذف المقال بنجاح' 
    })
  } catch (error) {
    console.error('خطأ في حذف المقال:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المقال' },
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