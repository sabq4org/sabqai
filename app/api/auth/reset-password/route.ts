import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { logActivity, extractRequestInfo } from '@/lib/activity-logger'

export async function POST(request: NextRequest) {
  const { ipAddress, userAgent } = extractRequestInfo(request)
  
  try {
    const { token, newPassword } = await request.json()
    
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'الرمز وكلمة المرور الجديدة مطلوبان' },
        { status: 400 }
      )
    }
    
    // التحقق من كلمة المرور الجديدة
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }
    
    // البحث عن الرمز
    const resetToken = await prisma.sabq_password_reset_tokens.findUnique({
      where: { token },
      include: { user: true },
    })
    
    // التحقق من وجود الرمز
    if (!resetToken) {
      // تسجيل محاولة برمز غير صالح
      await logActivity({
        action: 'reset_password',
        details: { reason: 'invalid_token' },
        ipAddress,
        userAgent
      })
      
      return NextResponse.json(
        { error: 'رمز إعادة التعيين غير صالح' },
        { status: 400 }
      )
    }
    
    // التحقق من صلاحية الرمز
    if (resetToken.expiresAt < new Date()) {
      // حذف الرمز المنتهي
      await prisma.sabq_password_reset_tokens.delete({
        where: { id: resetToken.id },
      })
      
      // تسجيل محاولة برمز منتهي
      await logActivity({
        userId: resetToken.userId,
        action: 'reset_password',
        details: { reason: 'expired_token' },
        ipAddress,
        userAgent
      })
      
      return NextResponse.json(
        { error: 'انتهت صلاحية رمز إعادة التعيين' },
        { status: 400 }
      )
    }
    
    // التحقق من أن الرمز لم يُستخدم
    if (resetToken.used) {
      // تسجيل محاولة برمز مستخدم
      await logActivity({
        userId: resetToken.userId,
        action: 'reset_password',
        details: { reason: 'used_token' },
        ipAddress,
        userAgent
      })
      
      return NextResponse.json(
        { error: 'تم استخدام رمز إعادة التعيين مسبقاً' },
        { status: 400 }
      )
    }
    
    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // تحديث كلمة المرور
    await prisma.sabq_users.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    })
    
    // تحديد الرمز كمستخدم
    await prisma.sabq_password_reset_tokens.update({
      where: { id: resetToken.id },
      data: { used: true },
    })
    
    // حذف جميع جلسات المستخدم القديمة لأسباب أمنية
    await prisma.sabq_sessions.deleteMany({
      where: { userId: resetToken.userId },
    })
    
    // تسجيل إعادة تعيين ناجحة
    await logActivity({
      userId: resetToken.userId,
      action: 'reset_password',
      details: { success: true },
      ipAddress,
      userAgent
    })
    
    return NextResponse.json({
      message: 'تم تغيير كلمة المرور بنجاح'
    })
    
  } catch (error) {
    console.error('Error in reset-password:', error)
    
    // تسجيل خطأ
    await logActivity({
      action: 'error',
      resource: 'reset_password',
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      ipAddress,
      userAgent
    })
    
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة الطلب' },
      { status: 500 }
    )
  }
} 