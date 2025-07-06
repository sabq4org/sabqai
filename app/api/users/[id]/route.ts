import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// GET - جلب مستخدم محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.sabqUser.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المستخدم' },
      { status: 500 }
    )
  }
}

// PUT - تحديث مستخدم
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    // التحقق من وجود المستخدم
    const existingUser = await prisma.sabqUser.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // إعداد البيانات للتحديث
    const updateData: any = {}
    if (email) updateData.email = email
    if (name !== undefined) updateData.name = name
    if (role) updateData.role = role
    if (password) {
      updateData.password = await hashPassword(password)
    }

    // تحديث المستخدم
    const user = await prisma.sabqUser.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث المستخدم' },
      { status: 500 }
    )
  }
}

// DELETE - حذف مستخدم
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // التحقق من وجود المستخدم
    const existingUser = await prisma.sabqUser.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // حذف المستخدم
    await prisma.sabqUser.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'تم حذف المستخدم بنجاح' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المستخدم' },
      { status: 500 }
    )
  }
} 