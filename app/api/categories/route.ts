import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const is_active = searchParams.get('is_active')

    const where: any = {}
    if (is_active !== null) {
      where.is_active = is_active === 'true'
    }

    const categories = await prisma.sabq_categories.findMany({
      where,
      orderBy: {
        display_order: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const category = await prisma.sabq_categories.create({
      data: {
        name: body.name,
        name_en: body.name_en,
        slug: body.slug,
        description: body.description,
        color: body.color,
        icon: body.icon,
        display_order: body.display_order || 0,
        is_active: body.is_active ?? true,
        parent_id: body.parent_id,
        metadata: body.metadata
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 