import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // التحقق من وجود دور المستخدم
    let userRole = await prisma.sabq_roles.findFirst({
      where: {
        OR: [
          { name: 'user' },
          { id: 'user-role-id' }
        ]
      }
    })

    if (!userRole) {
      // إنشاء دور المستخدم
      userRole = await prisma.sabq_roles.create({
        data: {
          id: 'user-role-id',
          name: 'user',
          nameAr: 'مستخدم',
          description: 'دور المستخدم العادي',
          isActive: true
        }
      })
      console.log('✅ تم إنشاء دور المستخدم')

      // إنشاء الصلاحيات الأساسية للمستخدم
      const permissions = [
        { name: 'profile.read', nameAr: 'عرض الملف الشخصي', resource: 'profile', action: 'read', description: 'عرض الملف الشخصي' },
        { name: 'profile.update', nameAr: 'تحديث الملف الشخصي', resource: 'profile', action: 'update', description: 'تحديث الملف الشخصي' },
        { name: 'comments.create', nameAr: 'إضافة تعليق', resource: 'comments', action: 'create', description: 'إضافة تعليقات' },
        { name: 'articles.read', nameAr: 'قراءة المقالات', resource: 'articles', action: 'read', description: 'قراءة المقالات' }
      ]

      for (const perm of permissions) {
        const permission = await prisma.sabq_permissions.upsert({
          where: { name: perm.name },
          update: {},
          create: perm
        })

        await prisma.sabq_role_permissions.create({
          data: {
            roleId: userRole.id,
            permissionId: permission.id
          }
        }).catch(() => {
          // تجاهل الخطأ إذا كانت الصلاحية موجودة بالفعل
        })
      }
      console.log('✅ تم إضافة الصلاحيات الأساسية')
    } else {
      console.log('⚠️  دور المستخدم موجود بالفعل:', userRole.id)
    }

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 