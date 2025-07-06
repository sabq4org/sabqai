import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/middleware'
import bcrypt from 'bcrypt'

// جلب جميع المستخدمين - يتطلب صلاحية users.read
export async function GET(request: NextRequest) {
  // التحقق من الصلاحية
  const authResult = await requirePermission(request, 'users', 'read')
  if (authResult instanceof NextResponse) return authResult
  
  try {
    const users = await prisma.sabq_users.findMany({
      include: {
        role: true,
        _count: {
          select: { sessions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // إزالة كلمات المرور من النتائج
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: {
        id: user.role?.id,
        name: user.role?.name,
        nameAr: user.role?.nameAr
      },
      sessionsCount: user._count.sessions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    return NextResponse.json({
      success: true,
      users: safeUsers,
      total: safeUsers.length
    })
  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error)
    return NextResponse.json(
      { success: false, error: 'فشل جلب المستخدمين' },
      { status: 500 }
    )
  }
}

// إنشاء مستخدم جديد - يتطلب صلاحية users.create
export async function POST(request: NextRequest) {
  // التحقق من الصلاحية
  const authResult = await requirePermission(request, 'users', 'create')
  if (authResult instanceof NextResponse) return authResult
  
  try {
    const body = await request.json()
    const { email, password, name, roleId } = body

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.sabq_users.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10)

    // إنشاء المستخدم
    const newUser = await prisma.sabq_users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: roleId || 'user-role-id' // الدور الافتراضي
      },
      include: {
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: {
          id: newUser.role?.id,
          name: newUser.role?.name,
          nameAr: newUser.role?.nameAr
        },
        createdAt: newUser.createdAt
      }
    })
  } catch (error) {
    console.error('خطأ في إنشاء المستخدم:', error)
    return NextResponse.json(
      { success: false, error: 'فشل إنشاء المستخدم' },
      { status: 500 }
    )
  }
} 