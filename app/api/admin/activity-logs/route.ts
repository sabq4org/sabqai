import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/permissions'
// import { getActivityLogs } from '@/lib/activity-logger'

export async function GET(request: NextRequest) {
  try {
    // التحقق من صلاحية system.view
    const authResult = await requirePermission(request, 'system', 'view')
    if (authResult instanceof NextResponse) return authResult

    // جلب المعاملات من الطلب
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || undefined
    const userId = searchParams.get('userId') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // جلب السجلات - مؤقتًا نعيد بيانات فارغة
    // const result = await getActivityLogs({
    //   action: action as any,
    //   userId,
    //   limit,
    //   offset
    // })

    return NextResponse.json({ logs: [], total: 0 })
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب السجلات' },
      { status: 500 }
    )
  }
} 