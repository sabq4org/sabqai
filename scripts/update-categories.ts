import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateCategories() {
  console.log('🔄 بدء تحديث التصنيفات...')

  const categories = [
    {
      name: 'تقنية',
      name_en: 'Technology',
      description: 'أخبار وتطورات التقنية والذكاء الاصطناعي',
      slug: 'technology',
      color: '#8B5CF6',
      icon: '💻',
      display_order: 1,
      is_active: true
    },
    {
      name: 'رياضة',
      name_en: 'Sports',
      description: 'أخبار رياضية محلية وعالمية',
      slug: 'sports',
      color: '#F59E0B',
      icon: '⚽',
      display_order: 2,
      is_active: true
    },
    {
      name: 'اقتصاد',
      name_en: 'Economy',
      description: 'تقارير السوق والمال والأعمال والطاقة',
      slug: 'economy',
      color: '#10B981',
      icon: '💰',
      display_order: 3,
      is_active: true
    },
    {
      name: 'سياسة',
      name_en: 'Politics',
      description: 'مستجدات السياسة المحلية والدولية وتحليلاتها',
      slug: 'politics',
      color: '#EF4444',
      icon: '🏛️',
      display_order: 4,
      is_active: true
    },
    {
      name: 'محليات',
      name_en: 'Local',
      description: 'أخبار المناطق والمدن السعودية',
      slug: 'local',
      color: '#3B82F6',
      icon: '🗺️',
      display_order: 5,
      is_active: true
    },
    {
      name: 'ثقافة ومجتمع',
      name_en: 'Culture',
      description: 'فعاليات ثقافية، مناسبات، قضايا اجتماعية',
      slug: 'culture',
      color: '#EC4899',
      icon: '🎭',
      display_order: 6,
      is_active: true
    },
    {
      name: 'مقالات رأي',
      name_en: 'Opinion',
      description: 'تحليلات ووجهات نظر كتاب الرأي',
      slug: 'opinion',
      color: '#7C3AED',
      icon: '✍️',
      display_order: 7,
      is_active: true
    },
    {
      name: 'منوعات',
      name_en: 'Misc',
      description: 'أخبار خفيفة، لقطات، طرائف وأحداث غير تقليدية',
      slug: 'misc',
      color: '#6B7280',
      icon: '🎉',
      display_order: 8,
      is_active: true
    }
  ]

  // تحديث أو إضافة التصنيفات
  console.log('✨ تحديث التصنيفات...')
  for (const category of categories) {
    await prisma.sabq_categories.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        name_en: category.name_en,
        description: category.description,
        color: category.color,
        icon: category.icon,
        display_order: category.display_order,
        is_active: category.is_active
      },
      create: category
    })
    console.log(`✅ تم تحديث/إضافة تصنيف: ${category.name}`)
  }

  // تعطيل التصنيفات القديمة غير الموجودة في القائمة الجديدة
  const newSlugs = categories.map(c => c.slug)
  await prisma.sabq_categories.updateMany({
    where: {
      slug: {
        notIn: newSlugs
      }
    },
    data: {
      is_active: false
    }
  })
  console.log('🔄 تم تعطيل التصنيفات القديمة')

  console.log('🎉 تم تحديث جميع التصنيفات بنجاح!')
}

updateCategories()
  .catch((e) => {
    console.error('❌ خطأ في تحديث التصنيفات:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 