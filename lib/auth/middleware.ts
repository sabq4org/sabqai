import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { checkUserPermission, checkUserPermissions, Permission } from './permissions'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// استخراج معلومات المستخدم من التوكن
export async function getUserFromToken(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.userId,
      email: decoded.email
    }
  } catch (error) {
    return null
  }
}

// Middleware للتحقق من تسجيل الدخول
export async function requireAuth(request: NextRequest) {
  const user = await getUserFromToken(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'غير مصرح', message: 'يجب تسجيل الدخول أولاً' },
      { status: 401 }
    )
  }
  
  return user
}

// Middleware للتحقق من صلاحية واحدة
export async function requirePermission(
  request: NextRequest,
  resource: string,
  action: string
) {
  const user = await getUserFromToken(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'غير مصرح', message: 'يجب تسجيل الدخول أولاً' },
      { status: 401 }
    )
  }
  
  const hasPermission = await checkUserPermission(user.id, resource, action)
  
  if (!hasPermission) {
    return NextResponse.json(
      { 
        error: 'ممنوع', 
        message: `ليس لديك صلاحية ${action} على ${resource}` 
      },
      { status: 403 }
    )
  }
  
  return user
}

// Middleware للتحقق من عدة صلاحيات
export async function requirePermissions(
  request: NextRequest,
  permissions: Permission[]
) {
  const user = await getUserFromToken(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'غير مصرح', message: 'يجب تسجيل الدخول أولاً' },
      { status: 401 }
    )
  }
  
  const hasPermissions = await checkUserPermissions(user.id, permissions)
  
  if (!hasPermissions) {
    return NextResponse.json(
      { 
        error: 'ممنوع', 
        message: 'ليس لديك الصلاحيات المطلوبة' 
      },
      { status: 403 }
    )
  }
  
  return user
}

// Middleware للتحقق من صلاحية الوصول للوحة التحكم
export async function requireDashboardAccess(request: NextRequest) {
  return requirePermission(request, 'dashboard', 'access')
}

// Helper function لإنشاء response مع معلومات المستخدم
export function withUser(user: any, data: any = {}) {
  return {
    ...data,
    user: {
      id: user.id,
      email: user.email
    }
  }
} 