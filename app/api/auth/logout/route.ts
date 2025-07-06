import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    // الحصول على التوكن من الهيدر
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: true, message: 'تم تسجيل الخروج بنجاح' },
        { status: 200 }
      )
    }

    try {
      // التحقق من التوكن وحذف الجلسات
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      
      // حذف جميع جلسات المستخدم
      await prisma.sabq_sessions.deleteMany({
        where: { userId: decoded.id }
      })
      
      console.log(`✅ تم تسجيل خروج المستخدم: ${decoded.id}`)
    } catch (error) {
      // حتى لو فشل التحقق من التوكن، نعتبر عملية الخروج ناجحة
      console.log('⚠️ توكن غير صالح، لكن سيتم تسجيل الخروج')
    }

    // إنشاء response مع حذف الكوكيز
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    })

    // حذف الكوكيز
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // حذف فوري
      path: '/'
    })

    response.cookies.set('user', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // حذف فوري
      path: '/'
    })

    return response
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تسجيل الخروج' },
      { status: 500 }
    )
  }
} 