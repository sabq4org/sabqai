import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    const user = await prisma.sabq_users.findUnique({
      where: { id: decoded.userId },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error('خطأ في جلب الملف الشخصي:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const body = await request.json()
    
    // التحقق من البيانات المدخلة
    const { name } = body
    
    // تحديث بيانات المستخدم
    const updatedUser = await prisma.sabq_users.update({
      where: { id: decoded.userId },
      data: {
        name: name || undefined,
        updatedAt: new Date()
      },
      include: {
        role: true
      }
    })

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt
    })
  } catch (error) {
    console.error('خطأ في تحديث الملف الشخصي:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث البيانات' },
      { status: 500 }
    )
  }
} 