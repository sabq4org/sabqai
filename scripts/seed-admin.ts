import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // التحقق من وجود الدور
    let adminRole = await prisma.sabq_roles.findFirst({
      where: { name: 'مدير النظام' }
    })

    if (!adminRole) {
      // إنشاء دور المدير
      adminRole = await prisma.sabq_roles.create({
        data: {
          name: 'مدير النظام',
          nameAr: 'مدير النظام',
          description: 'دور المدير الرئيسي للنظام',
          isActive: true
        }
      })
      console.log('✅ تم إنشاء دور المدير')

      // إنشاء الصلاحيات
      const permissions = [
        { name: 'users.read', nameAr: 'عرض المستخدمين', resource: 'users', action: 'read' },
        { name: 'users.create', nameAr: 'إنشاء مستخدمين', resource: 'users', action: 'create' },
        { name: 'users.update', nameAr: 'تحديث المستخدمين', resource: 'users', action: 'update' },
        { name: 'users.delete', nameAr: 'حذف المستخدمين', resource: 'users', action: 'delete' },
        { name: 'roles.read', nameAr: 'عرض الأدوار', resource: 'roles', action: 'read' },
        { name: 'roles.create', nameAr: 'إنشاء أدوار', resource: 'roles', action: 'create' },
        { name: 'roles.update', nameAr: 'تحديث الأدوار', resource: 'roles', action: 'update' },
        { name: 'roles.delete', nameAr: 'حذف الأدوار', resource: 'roles', action: 'delete' },
        { name: 'admin.access', nameAr: 'الوصول للوحة الإدارة', resource: 'admin', action: 'access' }
      ]

      for (const perm of permissions) {
        const permission = await prisma.sabq_permissions.upsert({
          where: { name: perm.name },
          update: {},
          create: perm
        })

        await prisma.sabq_role_permissions.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        })
      }
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.sabq_users.findUnique({
      where: { email: 'admin@sabq.ai' }
    })

    if (existingUser) {
      console.log('⚠️  المستخدم admin@sabq.ai موجود بالفعل')
      return
    }

    // إنشاء المستخدم
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = await prisma.sabq_users.create({
      data: {
        email: 'admin@sabq.ai',
        password: hashedPassword,
        name: 'مدير النظام',
        roleId: adminRole.id
      }
    })

    console.log('✅ تم إنشاء المستخدم admin@sabq.ai بنجاح')
    console.log('   البريد الإلكتروني: admin@sabq.ai')
    console.log('   كلمة المرور: admin123')
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 