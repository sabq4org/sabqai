import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// أنواع الصلاحيات
export interface Permission {
  resource: string
  action: string
}

// التحقق من صلاحية واحدة
export async function checkUserPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    const user = await prisma.sabq_users.findUnique({
      where: { id: userId },
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

    if (!user || !user.role) {
      return false
    }

    // التحقق من الصلاحية
    const hasPermission = user.role.permissions.some(
      rp => rp.permission.resource === resource && rp.permission.action === action
    )

    return hasPermission
  } catch (error) {
    console.error('خطأ في التحقق من الصلاحية:', error)
    return false
  }
}

// التحقق من عدة صلاحيات (يجب أن تكون جميعها متوفرة)
export async function checkUserPermissions(
  userId: string,
  permissions: Permission[]
): Promise<boolean> {
  try {
    const user = await prisma.sabq_users.findUnique({
      where: { id: userId },
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

    if (!user || !user.role) {
      return false
    }

    // التحقق من جميع الصلاحيات المطلوبة
    const userPermissions = user.role.permissions.map(rp => ({
      resource: rp.permission.resource,
      action: rp.permission.action
    }))

    return permissions.every(required =>
      userPermissions.some(
        userPerm => 
          userPerm.resource === required.resource && 
          userPerm.action === required.action
      )
    )
  } catch (error) {
    console.error('خطأ في التحقق من الصلاحيات:', error)
    return false
  }
}

// التحقق من دور المستخدم
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const user = await prisma.sabq_users.findUnique({
      where: { id: userId },
      include: { role: true }
    })

    return user?.role?.name || null
  } catch (error) {
    console.error('خطأ في جلب دور المستخدم:', error)
    return null
  }
}

// التحقق من صلاحية الوصول للوحة التحكم
export async function canAccessDashboard(userId: string): Promise<boolean> {
  return checkUserPermission(userId, 'dashboard', 'access')
}

// أدوار مساعدة سريعة
export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'admin'
}

export async function isEditor(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'editor'
}

export async function isUser(userId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  return role === 'user'
}

// دالة للتحقق من الصلاحيات في API routes
export async function requirePermission(
  request: Request,
  resource: string,
  action: string
): Promise<NextResponse | null> {
  try {
    // استخراج التوكن من الهيدر
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      )
    }

    // فك تشفير التوكن
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    
    // التحقق من الصلاحية
    const hasPermission = await checkUserPermission(decoded.userId, resource, action)
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'ليس لديك الصلاحية للقيام بهذا الإجراء' },
        { status: 403 }
      )
    }

    // إذا كان لديه الصلاحية، نعيد null للسماح بالمتابعة
    return null
  } catch (error) {
    console.error('خطأ في التحقق من الصلاحيات:', error)
    return NextResponse.json(
      { error: 'خطأ في التحقق من الصلاحيات' },
      { status: 500 }
    )
  }
} 