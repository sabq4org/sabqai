import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.sabq_users.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password)

    // إنشاء المستخدم
    const user = await prisma.sabq_users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: 'user-role', // الدور الافتراضي للمستخدم الجديد
      },
      include: {
        role: true, // جلب معلومات الدور
      },
    })

    // إنشاء JWT token
    const token = createToken(user.id)

    // إرجاع بيانات المستخدم مع التوكن
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role?.nameAr || 'مستخدم', // استخدام اسم الدور العربي
        permissions: [], // يمكن إضافة الصلاحيات لاحقاً إذا لزم الأمر
      },
      token,
    }, { status: 201 })
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في التسجيل' },
      { status: 500 }
    )
  }
} 