import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
// import { logActivity, extractRequestInfo } from '@/lib/activity-logger'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  // const { ipAddress, userAgent } = extractRequestInfo(request)
  const ipAddress = 'unknown'
  const userAgent = 'unknown'
  
  try {
    const { email, password } = await request.json()
    
    console.log('🔑 محاولة تسجيل دخول:', { email, password: '***' })

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم مع الدور والصلاحيات
    const user = await prisma.sabq_users.findUnique({
      where: { email },
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
    
    console.log('👤 المستخدم موجود:', !!user)

    if (!user) {
      // تسجيل محاولة دخول فاشلة
      // await logActivity({
      //   action: 'login',
      //   details: { email, reason: 'user_not_found' },
      //   ipAddress,
      //   userAgent
      // })
      
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    console.log('🔐 كلمة المرور صحيحة:', isValidPassword)

    if (!isValidPassword) {
      // تسجيل محاولة دخول فاشلة
      // await logActivity({
      //   userId: user.id,
      //   action: 'login',
      //   details: { reason: 'invalid_password' },
      //   ipAddress,
      //   userAgent
      // })
      
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // إنشاء جلسة جديدة
    const sessionToken = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        roleId: user.roleId 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // حفظ الجلسة في قاعدة البيانات
    await prisma.sabq_sessions.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 أيام
      }
    })
    
    // تسجيل دخول ناجح
    // await logActivity({
    //   userId: user.id,
    //   action: 'login',
    //   details: { success: true },
    //   ipAddress,
    //   userAgent
    // })
    
    // إعداد cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 أيام
    })
    
    // إعداد بيانات المستخدم للإرجاع
    const permissions = user.role?.permissions.map(rp => ({
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action
    })) || []
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role ? {
          id: user.role.id,
          name: user.role.name,
          nameAr: user.role.nameAr
        } : null,
        permissions
      },
      token: sessionToken
    })
    
  } catch (error) {
    console.error('Login error:', error)
    console.error('Error details:', error instanceof Error ? error.stack : 'Unknown error')
    
    // تسجيل خطأ
    // await logActivity({
    //   action: 'error',
    //   resource: 'login',
    //   details: { error: error instanceof Error ? error.message : 'Unknown error' },
    //   ipAddress,
    //   userAgent
    // })
    
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    )
  }
} 