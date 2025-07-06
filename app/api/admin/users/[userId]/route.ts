import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/middleware'
import bcrypt from 'bcrypt'

// حذف مستخدم - يتطلب صلاحية users.delete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const authResult = await requirePermission(request, 'users', 'delete')
  if (authResult instanceof NextResponse) return authResult
  
  try {
    const { user } = authResult

    // التحقق من وجود المستخدم
    const userToDelete = await prisma.sabq_users.findUnique({
      where: { id: params.userId },
      include: { role: true }
    })

    if (!userToDelete) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // منع حذف المستخدم نفسه
    if (userToDelete.id === user.id) {
      return NextResponse.json(
        { success: false, error: 'لا يمكنك حذف حسابك الخاص' },
        { status: 400 }
      )
    }

    // منع حذف آخر مدير
    if (userToDelete.role?.name === 'admin') {
      const adminCount = await prisma.sabq_users.count({
        where: {
          role: { name: 'admin' }
        }
      })

      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, error: 'لا يمكن حذف آخر مدير في النظام' },
          { status: 400 }
        )
      }
    }

    // حذف جلسات المستخدم أولاً
    await prisma.sabq_sessions.deleteMany({
      where: { userId: params.userId }
    })

    // حذف المستخدم
    await prisma.sabq_users.delete({
      where: { id: params.userId }
    })

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    })
  } catch (error) {
    console.error('خطأ في حذف المستخدم:', error)
    return NextResponse.json(
      { success: false, error: 'فشل حذف المستخدم' },
      { status: 500 }
    )
  }
}
