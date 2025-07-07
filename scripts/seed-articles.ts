import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة المقالات التجريبية...')

  try {
    // جلب التصنيفات والمستخدمين
    const categories = await prisma.sabq_categories.findMany()
    const authors = await prisma.sabq_users.findMany({
      where: {
        role: {
          name: {
            in: ['admin', 'editor', 'author']
          }
        }
      }
    })

    if (categories.length === 0 || authors.length === 0) {
      console.error('❌ يجب أن تكون هناك تصنيفات ومستخدمين أولاً')
      return
    }

    const articles = [
      {
        title: 'تطورات جديدة في عالم الذكاء الاصطناعي',
        slug: 'ai-new-developments',
        content: 'محتوى المقال عن تطورات الذكاء الاصطناعي...',
        excerpt: 'نظرة على أحدث التطورات في مجال الذكاء الاصطناعي وتأثيرها على المستقبل',
        status: 'published',
        isPinned: true,
        tags: ['تقنية', 'ذكاء اصطناعي', 'مستقبل'],
        viewCount: 1234,
        categoryId: categories.find(c => c.slug === 'technology')?.id || categories[0].id,
        authorId: authors[0].id,
        publishedAt: new Date()
      },
      {
        title: 'نتائج مباراة الهلال والنصر في ديربي الرياض',
        slug: 'hilal-nasr-derby-results',
        content: 'تفاصيل المباراة المثيرة بين الهلال والنصر...',
        excerpt: 'ملخص شامل لمباراة القمة بين الهلال والنصر',
        status: 'published',
        tags: ['رياضة', 'كرة القدم', 'دوري المحترفين'],
        viewCount: 5678,
        categoryId: categories.find(c => c.slug === 'sports')?.id || categories[1].id,
        authorId: authors[0].id,
        publishedAt: new Date(Date.now() - 86400000) // أمس
      },
      {
        title: 'تحليل اقتصادي: نمو الناتج المحلي في الربع الأول',
        slug: 'economic-analysis-q1',
        content: 'تحليل مفصل للأداء الاقتصادي...',
        excerpt: 'دراسة تحليلية لمؤشرات النمو الاقتصادي',
        status: 'draft',
        tags: ['اقتصاد', 'تحليل', 'نمو'],
        categoryId: categories.find(c => c.slug === 'economy')?.id || categories[2].id,
        authorId: authors[1]?.id || authors[0].id
      },
      {
        title: 'فعاليات موسم الرياض 2024',
        slug: 'riyadh-season-2024',
        content: 'جميع الفعاليات والأنشطة في موسم الرياض...',
        excerpt: 'دليل شامل لفعاليات موسم الرياض',
        status: 'published',
        tags: ['ترفيه', 'سياحة', 'فعاليات'],
        viewCount: 3456,
        categoryId: categories.find(c => c.slug === 'entertainment')?.id || categories[3].id,
        authorId: authors[0].id,
        publishedAt: new Date()
      },
      {
        title: 'مستجدات التعليم: نظام الفصول الثلاثة',
        slug: 'education-three-semesters',
        content: 'شرح تفصيلي للنظام الجديد...',
        excerpt: 'كل ما تحتاج معرفته عن نظام الفصول الثلاثة',
        status: 'archived',
        tags: ['تعليم', 'تطوير', 'نظام'],
        viewCount: 890,
        categoryId: categories[0].id,
        authorId: authors[0].id,
        publishedAt: new Date(Date.now() - 604800000) // قبل أسبوع
      }
    ]

    // إضافة المقالات
    for (const article of articles) {
      const created = await prisma.sabq_articles.create({
        data: article
      })
      console.log(`✅ تم إضافة مقال: ${created.title}`)
    }

    // إضافة بعض التعليقات والإعجابات
    const allArticles = await prisma.sabq_articles.findMany({
      where: { status: 'published' }
    })

    const users = await prisma.sabq_users.findMany()

    for (const article of allArticles.slice(0, 2)) {
      // إضافة تعليقات
      await prisma.sabq_comments.create({
        data: {
          content: 'مقال رائع ومفيد جداً!',
          articleId: article.id,
          userId: users[1]?.id || users[0].id,
          status: 'approved'
        }
      })

      // إضافة إعجابات
      for (const user of users.slice(0, 3)) {
        await prisma.sabq_likes.create({
          data: {
            articleId: article.id,
            userId: user.id
          }
        }).catch(() => {}) // تجاهل الأخطاء في حالة الإعجاب المكرر
      }

      // إضافة مشاهدات
      for (let i = 0; i < 5; i++) {
        await prisma.sabq_article_views.create({
          data: {
            articleId: article.id,
            userId: users[i]?.id,
            ipAddress: `192.168.1.${i + 1}`
          }
        })
      }
    }

    console.log('✅ تم إضافة جميع المقالات والبيانات المرتبطة بنجاح!')

  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 