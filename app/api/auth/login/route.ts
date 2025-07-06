import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
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
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await comparePassword(password, user.password)
    
    console.log('🔐 كلمة المرور صحيحة:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    // إنشاء JWT token
    const token = createToken(user.id)

    // تحضير قائمة الصلاحيات
    const permissions = user.role?.permissions.map(rp => ({
      id: rp.permission.id,
      name: rp.permission.name,
      nameAr: rp.permission.nameAr,
      resource: rp.permission.resource,
      action: rp.permission.action
    })) || []

    // إرجاع بيانات المستخدم مع التوكن
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: {
          id: user.role?.id,
          name: user.role?.name,
          nameAr: user.role?.nameAr
        },
        permissions
      },
      token,
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    )
  }
} 