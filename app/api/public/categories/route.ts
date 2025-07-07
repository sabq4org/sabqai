import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const categories = await prisma.sabq_categories.findMany({
      where: {
        is_active: true
      },
      orderBy: {
        display_order: 'asc'
      },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                status: 'published'
              }
            }
          }
        }
      }
    })

    // Transform the data
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color,
      icon: category.icon,
      articleCount: category._count.articles
    }))

    return NextResponse.json({
      success: true,
      data: transformedCategories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 