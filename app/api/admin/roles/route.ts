import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/middleware'

// جلب جميع الأدوار - يتطلب صلاحية users.read
export async function GET(request: NextRequest) {
  // التحقق من الصلاحية
  const authResult = await requirePermission(request, 'users', 'read')
  if (authResult instanceof NextResponse) return authResult
  
  try {
    const roles = await prisma.sabq_roles.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      roles
    })
  } catch (error) {
    console.error('خطأ في جلب الأدوار:', error)
    return NextResponse.json(
      { success: false, error: 'فشل جلب الأدوار' },
      { status: 500 }
    )
  }
} 