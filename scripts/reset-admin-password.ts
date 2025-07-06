import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    const email = 'admin@sabq.ai'
    const newPassword = 'admin123'
    
    // التحقق من وجود المستخدم
    const user = await prisma.sabq_users.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('❌ المستخدم غير موجود')
      return
    }

    // تحديث كلمة المرور
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.sabq_users.update({
      where: { email },
      data: { password: hashedPassword }
    })

    console.log('✅ تم تحديث كلمة المرور بنجاح')
    console.log(`   البريد الإلكتروني: ${email}`)
    console.log(`   كلمة المرور الجديدة: ${newPassword}`)
  } catch (error) {
    console.error('❌ خطأ في تحديث كلمة المرور:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 