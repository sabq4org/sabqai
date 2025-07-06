import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generatePasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'
import { logActivity, extractRequestInfo } from '@/lib/activity-logger'

export async function POST(request: NextRequest) {
  const { ipAddress, userAgent } = extractRequestInfo(request)
  
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }
    
    // البحث عن المستخدم
    const user = await prisma.sabq_users.findUnique({
      where: { email },
    })
    
    // إذا لم يجد المستخدم، نرجع نجاح لأسباب أمنية
    if (!user) {
      // تسجيل محاولة مع بريد غير موجود
      await logActivity({
        action: 'forgot_password',
        details: { email, found: false },
        ipAddress,
        userAgent
      })
      
      return NextResponse.json({
        message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين'
      })
    }
    
    // إنشاء رمز عشوائي
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // حفظ الرمز في قاعدة البيانات
    await prisma.sabq_password_reset_tokens.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // ساعة واحدة
      },
    })
    
    // إنشاء رابط إعادة التعيين
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`
    
    // إرسال البريد الإلكتروني
    const { subject, html } = generatePasswordResetEmail(user.name || '', resetLink)
    await sendEmail({
      to: email,
      subject,
      html,
    })
    
    // تسجيل طلب إعادة تعيين ناجح
    await logActivity({
      userId: user.id,
      action: 'forgot_password',
      details: { success: true },
      ipAddress,
      userAgent
    })
    
    return NextResponse.json({
      message: 'إذا كان البريد الإلكتروني مسجلاً، سيتم إرسال رابط إعادة التعيين'
    })
    
  } catch (error) {
    console.error('Error in forgot-password:', error)
    
    // تسجيل خطأ
    await logActivity({
      action: 'error',
      resource: 'forgot_password',
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