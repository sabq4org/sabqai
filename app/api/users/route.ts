import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// GET - جلب كل المستخدمين
export async function GET() {
  try {
    const users = await prisma.sabq_users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المستخدمين' },
      { status: 500 }
    )
  }
}

// POST - إنشاء مستخدم جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'user' } = body

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.sabq_users.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'المستخدم موجود بالفعل' },
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
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المستخدم' },
      { status: 500 }
    )
  }
} 