import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
    { name: 'system.view', nameAr: 'عرض سجلات النشاط', resource: 'system', action: 'view' },
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

  // 5. إنشاء التصنيفات
  const categories = [
    { 
      name: 'تقنية', 
      name_en: 'Technology', 
      description: 'أخبار وتطورات التقنية والذكاء الاصطناعي',
      slug: 'technology', 
      color: '#8B5CF6', 
      icon: '💻', 
      display_order: 1 
    },
    { 
      name: 'رياضة', 
      name_en: 'Sports', 
      description: 'أخبار رياضية محلية وعالمية',
      slug: 'sports', 
      color: '#F59E0B', 
      icon: '⚽', 
      display_order: 2 
    },
    { 
      name: 'اقتصاد', 
      name_en: 'Economy', 
      description: 'تقارير السوق والمال والأعمال والطاقة',
      slug: 'economy', 
      color: '#10B981', 
      icon: '💰', 
      display_order: 3 
    },
    { 
      name: 'سياسة', 
      name_en: 'Politics', 
      description: 'مستجدات السياسة المحلية والدولية وتحليلاتها',
      slug: 'politics', 
      color: '#EF4444', 
      icon: '🏛️', 
      display_order: 4 
    },
    { 
      name: 'محليات', 
      name_en: 'Local', 
      description: 'أخبار المناطق والمدن السعودية',
      slug: 'local', 
      color: '#3B82F6', 
      icon: '🗺️', 
      display_order: 5 
    },
    { 
      name: 'ثقافة ومجتمع', 
      name_en: 'Culture', 
      description: 'فعاليات ثقافية، مناسبات، قضايا اجتماعية',
      slug: 'culture', 
      color: '#EC4899', 
      icon: '🎭', 
      display_order: 6 
    },
    { 
      name: 'مقالات رأي', 
      name_en: 'Opinion', 
      description: 'تحليلات ووجهات نظر كتاب الرأي',
      slug: 'opinion', 
      color: '#7C3AED', 
      icon: '✍️', 
      display_order: 7 
    },
    { 
      name: 'منوعات', 
      name_en: 'Misc', 
      description: 'أخبار خفيفة، لقطات، طرائف وأحداث غير تقليدية',
      slug: 'misc', 
      color: '#6B7280', 
      icon: '🎉', 
      display_order: 8 
    }
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.sabq_categories.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    })
    createdCategories.push(category)
  }

  console.log('✅ تم إنشاء التصنيفات')

  // 6. إنشاء مقالات تجريبية
  const admin = await prisma.sabq_users.findFirst({ where: { email: 'admin@sabq.ai' } })
  const editor = await prisma.sabq_users.findFirst({ where: { email: 'editor@sabq.ai' } })

  if (admin && editor) {
    const articles = [
      {
        title: 'المملكة تستضيف قمة الذكاء الاصطناعي العالمية 2025',
        slug: 'saudi-hosts-ai-summit-2025',
        content: `تستعد المملكة العربية السعودية لاستضافة أكبر حدث عالمي للذكاء الاصطناعي في الشرق الأوسط...`,
        excerpt: 'تستعد المملكة العربية السعودية لاستضافة أكبر حدث عالمي للذكاء الاصطناعي في الشرق الأوسط، بمشاركة أبرز الخبراء والشركات العالمية.',
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        status: 'published',
        isPinned: true,
        tags: ['ai-generated', 'technology', 'saudi'],
        viewCount: 1250,
        authorId: admin.id,
        categoryId: createdCategories.find(c => c.slug === 'technology')!.id,
        publishedAt: new Date()
      },
      {
        title: 'نمو الاقتصاد السعودي يتجاوز التوقعات في الربع الأول',
        slug: 'saudi-economy-growth-q1',
        content: `سجل الاقتصاد السعودي نمواً قوياً في الربع الأول من العام الحالي...`,
        excerpt: 'سجل الاقتصاد السعودي نمواً قوياً يتجاوز التوقعات بنسبة 5.9% في الربع الأول.',
        featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
        status: 'published',
        tags: ['economy', 'saudi', 'growth'],
        viewCount: 850,
        authorId: editor.id,
        categoryId: createdCategories.find(c => c.slug === 'economy')!.id,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // قبل ساعتين
      },
      {
        title: 'الهلال يتوج بطلاً لدوري روشن السعودي للمحترفين',
        slug: 'alhilal-wins-saudi-league',
        content: `توج نادي الهلال بطلاً لدوري روشن السعودي للمحترفين للموسم الحالي...`,
        excerpt: 'توج نادي الهلال بطلاً لدوري روشن السعودي بعد فوزه الكبير في المباراة الحاسمة.',
        featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
        status: 'published',
        tags: ['sports', 'football', 'saudi-league'],
        viewCount: 2100,
        authorId: editor.id,
        categoryId: createdCategories.find(c => c.slug === 'sports')!.id,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // قبل 5 ساعات
      },
      {
        title: 'افتتاح أكبر مستشفى متخصص في علاج السرطان بالرياض',
        slug: 'new-cancer-hospital-riyadh',
        content: `افتتحت وزارة الصحة أكبر مستشفى متخصص في علاج السرطان في العاصمة الرياض...`,
        excerpt: 'افتتاح أكبر مستشفى متخصص في علاج السرطان بالرياض بسعة 500 سرير.',
        featuredImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
        status: 'published',
        tags: ['health', 'medical', 'riyadh'],
        viewCount: 670,
        authorId: admin.id,
        categoryId: createdCategories.find(c => c.slug === 'local')!.id,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8) // قبل 8 ساعات
      },
      {
        title: 'موسم الرياض 2025 يستقبل 20 مليون زائر',
        slug: 'riyadh-season-2025-visitors',
        content: `أعلنت الهيئة العامة للترفيه عن وصول عدد زوار موسم الرياض إلى 20 مليون زائر...`,
        excerpt: 'موسم الرياض 2025 يحطم الأرقام القياسية باستقبال 20 مليون زائر من مختلف أنحاء العالم.',
        featuredImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
        status: 'published',
        tags: ['tourism', 'entertainment', 'riyadh-season'],
        viewCount: 1500,
        authorId: editor.id,
        categoryId: createdCategories.find(c => c.slug === 'culture')!.id,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // قبل يوم
      }
    ]

    for (const articleData of articles) {
      await prisma.sabq_articles.create({
        data: articleData
      })
    }

    console.log('✅ تم إنشاء المقالات التجريبية')
  }

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