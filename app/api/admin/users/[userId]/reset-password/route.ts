import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { generatePasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    // التحقق من صلاحية إعادة تعيين كلمات المرور
    const adminUser = await prisma.sabq_users.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })

    const hasPermission = adminUser?.role?.permissions.some(
      p => p.permission.resource === 'users' && p.permission.action === 'update'
    )

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية إعادة تعيين كلمات المرور' },
        { status: 403 }
      )
    }

    // جلب معلومات المستخدم
    const user = await prisma.sabq_users.findUnique({
      where: { id: params.userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // توليد رمز إعادة التعيين
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // حفظ الرمز في قاعدة البيانات
    await prisma.sabq_password_reset_tokens.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 3600000) // ساعة واحدة
      }
    })

    // إرسال البريد الإلكتروني
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    const emailHtml = await generatePasswordResetEmail(user.name || 'المستخدم', resetUrl)
    
    // هنا يمكن استخدام خدمة البريد الإلكتروني المفضلة لديك
    // مثل SendGrid, Mailgun, AWS SES, etc.
    console.log('إرسال بريد إعادة تعيين كلمة المرور إلى:', user.email)

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني'
    })
  } catch (error) {
    console.error('خطأ في إعادة تعيين كلمة المرور:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إعادة تعيين كلمة المرور' },
      { status: 500 }
    )
  }
} 