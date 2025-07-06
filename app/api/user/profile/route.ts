import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import bcrypt from 'bcrypt'

// جلب بيانات المستخدم الحالي
export async function GET(request: NextRequest) {
  try {
    // التحقق من التوكن
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'توكن غير صالح' },
        { status: 401 }
      )
    }

    // جلب بيانات المستخدم
    const user = await prisma.sabq_users.findUnique({
      where: { id: decoded.userId },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    )
  }
}

// تحديث بيانات المستخدم الحالي
export async function PUT(request: NextRequest) {
  try {
    // التحقق من التوكن
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'توكن غير صالح' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    // التحقق من وجود المستخدم
    const user = await prisma.sabq_users.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // بناء بيانات التحديث
    const updateData: any = {}
    
    // تحديث الاسم إذا تم تقديمه
    if (name !== undefined && name !== user.name) {
      updateData.name = name
    }

    // تحديث البريد الإلكتروني إذا تم تقديمه
    if (email && email !== user.email) {
      // التحقق من عدم وجود بريد مكرر
      const existingUser = await prisma.sabq_users.findUnique({
        where: { email }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        )
      }
      
      updateData.email = email
    }

    // تحديث كلمة المرور إذا تم تقديمها
    if (newPassword) {
      // التحقق من كلمة المرور الحالية
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'يجب إدخال كلمة المرور الحالية' },
          { status: 400 }
        )
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الحالية غير صحيحة' },
          { status: 400 }
        )
      }

      // التحقق من طول كلمة المرور الجديدة
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
          { status: 400 }
        )
      }

      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // إذا لم يكن هناك شيء للتحديث
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: true,
        message: 'لا توجد تغييرات للحفظ',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })
    }

    // تحديث المستخدم
    const updatedUser = await prisma.sabq_users.update({
      where: { id: decoded.userId },
      data: updateData,
      include: {
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: {
          id: updatedUser.role?.id,
          name: updatedUser.role?.name,
          nameAr: updatedUser.role?.nameAr
        }
      }
    })
  } catch (error) {
    console.error('خطأ في تحديث بيانات المستخدم:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث البيانات' },
      { status: 500 }
    )
  }
} 