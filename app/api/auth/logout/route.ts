import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { logActivity, extractRequestInfo } from '@/lib/activity-logger'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  const { ipAddress, userAgent } = extractRequestInfo(request)
  
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (token) {
      try {
        // فك تشفير التوكن للحصول على معلومات المستخدم
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        
        // حذف جميع جلسات المستخدم
        await prisma.sabq_sessions.deleteMany({
          where: { userId: decoded.userId }
        })
        
        // تسجيل خروج ناجح
        await logActivity({
          userId: decoded.userId,
          action: 'logout',
          details: { success: true },
          ipAddress,
          userAgent
        })
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
    
    // حذف الكوكيز
    cookieStore.delete('auth-token')
    
    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    })
  } catch (error) {
    console.error('Logout error:', error)
    
    // تسجيل خطأ
    await logActivity({
      action: 'error',
      resource: 'logout',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      ipAddress,
      userAgent
    })
    
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تسجيل الخروج' },
      { status: 500 }
    )
  }
} 