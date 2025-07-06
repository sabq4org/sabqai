import { prisma } from '@/lib/prisma'

export type ActivityAction = 
  | 'login'
  | 'logout'
  | 'register'
  | 'forgot_password'
  | 'reset_password'
  | 'update_profile'
  | 'update_user'
  | 'delete_user'
  | 'create_article'
  | 'update_article'
  | 'delete_article'
  | 'change_role'
  | 'unauthorized_access'
  | 'error'

interface LogActivityOptions {
  userId?: string
  action: ActivityAction
  resource?: string
  resourceId?: string
  details?: any
  ipAddress?: string
  userAgent?: string
}

export async function logActivity({
  userId,
  action,
  resource,
  resourceId,
  details,
  ipAddress,
  userAgent
}: LogActivityOptions) {
  try {
    await prisma.sabq_activity_logs.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent
      }
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
    // لا نريد أن يفشل الطلب الأساسي بسبب فشل تسجيل النشاط
  }
}

// دالة مساعدة لاستخراج معلومات الطلب
export function extractRequestInfo(request: Request) {
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  return { ipAddress, userAgent }
}

// دالة لجلب سجلات الأنشطة
export async function getActivityLogs({
  userId,
  action,
  limit = 50,
  offset = 0
}: {
  userId?: string
  action?: ActivityAction
  limit?: number
  offset?: number
}) {
  const where: any = {}
  
  if (userId) where.userId = userId
  if (action) where.action = action
  
  const [logs, total] = await Promise.all([
    prisma.sabq_activity_logs.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    }),
    prisma.sabq_activity_logs.count({ where })
  ])
  
  return { logs, total }
}

// دالة لحذف السجلات القديمة (للصيانة)
export async function cleanOldActivityLogs(daysToKeep: number = 90) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
  
  const result = await prisma.sabq_activity_logs.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate
      }
    }
  })
  
  return result
} 