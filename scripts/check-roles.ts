import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // جلب جميع الأدوار
    const roles = await prisma.sabq_roles.findMany({
      select: {
        id: true,
        name: true,
        nameAr: true,
        isActive: true,
        _count: {
          select: { users: true }
        }
      }
    })

    console.log('الأدوار الموجودة في قاعدة البيانات:')
    console.log('=====================================')
    
    roles.forEach(role => {
      console.log(`ID: ${role.id}`)
      console.log(`الاسم: ${role.name}`)
      console.log(`الاسم العربي: ${role.nameAr}`)
      console.log(`نشط: ${role.isActive ? 'نعم' : 'لا'}`)
      console.log(`عدد المستخدمين: ${role._count.users}`)
      console.log('-------------------------------------')
    })

    // البحث عن دور المستخدم الافتراضي
    const userRole = await prisma.sabq_roles.findFirst({
      where: {
        OR: [
          { name: 'user' },
          { name: 'مستخدم' },
          { nameAr: 'مستخدم' }
        ]
      }
    })

    if (!userRole) {
      console.log('\n⚠️  تحذير: لا يوجد دور افتراضي للمستخدمين!')
      console.log('يجب إنشاء دور "user" أو "مستخدم" لاستخدامه في التسجيل')
    } else {
      console.log(`\n✅ دور المستخدم الافتراضي موجود: ${userRole.id}`)
    }

  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 