import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء عملية البذر...')

  // 1. إنشاء الأدوار الأساسية
  const adminRole = await prisma.sabq_roles.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      nameAr: 'مدير',
      description: 'صلاحيات كاملة على النظام',
      isActive: true
    }
  })

  const editorRole = await prisma.sabq_roles.upsert({
    where: { name: 'editor' },
    update: {},
    create: {
      name: 'editor',
      nameAr: 'محرر',
      description: 'صلاحيات إدارة المحتوى',
      isActive: true
    }
  })

  const userRole = await prisma.sabq_roles.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      id: 'user-role-id', // نفس ID الافتراضي في schema
      name: 'user',
      nameAr: 'مستخدم',
      description: 'صلاحيات القراءة والتعليق',
      isActive: true
    }
  })

  console.log('✅ تم إنشاء الأدوار:', { adminRole, editorRole, userRole })

  // 2. إنشاء الصلاحيات الأساسية
  const permissions = [
    // صلاحيات المقالات
    { name: 'articles.create', nameAr: 'إنشاء مقال', resource: 'articles', action: 'create' },
    { name: 'articles.read', nameAr: 'قراءة المقالات', resource: 'articles', action: 'read' },
    { name: 'articles.update', nameAr: 'تحديث مقال', resource: 'articles', action: 'update' },
    { name: 'articles.delete', nameAr: 'حذف مقال', resource: 'articles', action: 'delete' },
    { name: 'articles.publish', nameAr: 'نشر مقال', resource: 'articles', action: 'publish' },
    
    // صلاحيات المستخدمين
    { name: 'users.create', nameAr: 'إنشاء مستخدم', resource: 'users', action: 'create' },
    { name: 'users.read', nameAr: 'عرض المستخدمين', resource: 'users', action: 'read' },
    { name: 'users.update', nameAr: 'تحديث مستخدم', resource: 'users', action: 'update' },
    { name: 'users.delete', nameAr: 'حذف مستخدم', resource: 'users', action: 'delete' },
    
    // صلاحيات التعليقات
    { name: 'comments.create', nameAr: 'إضافة تعليق', resource: 'comments', action: 'create' },
    { name: 'comments.read', nameAr: 'قراءة التعليقات', resource: 'comments', action: 'read' },
    { name: 'comments.update', nameAr: 'تحديث تعليق', resource: 'comments', action: 'update' },
    { name: 'comments.delete', nameAr: 'حذف تعليق', resource: 'comments', action: 'delete' },
    { name: 'comments.moderate', nameAr: 'إدارة التعليقات', resource: 'comments', action: 'moderate' },
    
    // صلاحيات لوحة التحكم
    { name: 'dashboard.access', nameAr: 'الوصول للوحة التحكم', resource: 'dashboard', action: 'access' },
    { name: 'dashboard.analytics', nameAr: 'عرض الإحصائيات', resource: 'dashboard', action: 'analytics' },
    
    // صلاحيات النظام
    { name: 'system.settings', nameAr: 'إعدادات النظام', resource: 'system', action: 'settings' },
    { name: 'system.logs', nameAr: 'عرض السجلات', resource: 'system', action: 'logs' },
  ]

  for (const perm of permissions) {
    await prisma.sabq_permissions.upsert({
      where: { name: perm.name },
      update: {},
      create: perm
    })
  }

  console.log('✅ تم إنشاء الصلاحيات')

  // 3. ربط الصلاحيات بالأدوار
  // المدير - جميع الصلاحيات
  const allPermissions = await prisma.sabq_permissions.findMany()
  for (const permission of allPermissions) {
    await prisma.sabq_role_permissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id
      }
    })
  }

  // المحرر - صلاحيات المحتوى
  const editorPermissions = await prisma.sabq_permissions.findMany({
    where: {
      OR: [
        { resource: 'articles' },
        { resource: 'comments' },
        { name: 'dashboard.access' },
        { name: 'dashboard.analytics' }
      ]
    }
  })

  for (const permission of editorPermissions) {
    await prisma.sabq_role_permissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: editorRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: editorRole.id,
        permissionId: permission.id
      }
    })
  }

  // المستخدم العادي - صلاحيات القراءة والتعليق
  const userPermissions = await prisma.sabq_permissions.findMany({
    where: {
      OR: [
        { name: 'articles.read' },
        { name: 'comments.create' },
        { name: 'comments.read' }
      ]
    }
  })

  for (const permission of userPermissions) {
    await prisma.sabq_role_permissions.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id
        }
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id
      }
    })
  }

  console.log('✅ تم ربط الصلاحيات بالأدوار')

  // 4. إنشاء مستخدمين تجريبيين مع الأدوار الجديدة
  const hashedPassword = await bcrypt.hash('Test@123456', 10)

  await prisma.sabq_users.upsert({
    where: { email: 'admin@sabq.ai' },
    update: { roleId: adminRole.id },
    create: {
      email: 'admin@sabq.ai',
      password: hashedPassword,
      name: 'مدير النظام',
      roleId: adminRole.id
    }
  })

  await prisma.sabq_users.upsert({
    where: { email: 'editor@sabq.ai' },
    update: { roleId: editorRole.id },
    create: {
      email: 'editor@sabq.ai',
      password: hashedPassword,
      name: 'محرر المحتوى',
      roleId: editorRole.id
    }
  })

  await prisma.sabq_users.upsert({
    where: { email: 'user@sabq.ai' },
    update: { roleId: userRole.id },
    create: {
      email: 'user@sabq.ai',
      password: hashedPassword,
      name: 'مستخدم عادي',
      roleId: userRole.id
    }
  })

  console.log('✅ تم إنشاء المستخدمين التجريبيين')
  console.log('🎉 اكتملت عملية البذر بنجاح!')
}

main()
  .catch((e) => {
    console.error('❌ خطأ في عملية البذر:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 