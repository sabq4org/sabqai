# سبق الذكية - Sabq AI

منصة إدارة المحتوى الذكية مع دعم الذكاء الاصطناعي

## المتطلبات

- Node.js 18+ 
- PostgreSQL (Supabase)
- npm أو yarn

## التثبيت المحلي

```bash
# استنساخ المشروع
git clone https://github.com/sabq4org/sabqai.git
cd sabqai

# تثبيت الحزم
npm install

# إنشاء ملف البيئة
cp .env.example .env

# تحديث ملف .env بمعلومات قاعدة البيانات
# DATABASE_URL="postgresql://..."
# JWT_SECRET="..."

# تشغيل migrations
npx prisma migrate deploy

# توليد Prisma Client
npx prisma generate

# تشغيل المشروع
npm run dev
```

## النشر على Vercel

### 1. إعداد قاعدة البيانات (Supabase)

1. أنشئ حساب على [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. احصل على connection string من Settings > Database
4. تأكد من أن قاعدة البيانات نشطة

### 2. إعداد Vercel

1. قم بربط المستودع مع Vercel
2. اذهب إلى Settings > Environment Variables
3. أضف المتغيرات التالية:

```
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres
JWT_SECRET=[نص عشوائي آمن]
```

### 3. تشغيل Migrations

بعد النشر الأول، قم بتشغيل migrations:

```bash
# من جهازك المحلي
DATABASE_URL="[نفس الرابط من Vercel]" npx prisma migrate deploy
```

### 4. التحقق من الاتصال

زر الرابط التالي للتحقق من صحة الاتصال:
```
https://your-domain.vercel.app/api/health/db
```

## حل المشاكل الشائعة

### خطأ "Can't reach database server"

1. تأكد من أن DATABASE_URL صحيح في Vercel
2. تأكد من أن قاعدة البيانات في Supabase نشطة
3. تحقق من عدم وجود مسافات في بداية أو نهاية القيمة
4. جرب إعادة النشر (Redeploy) من Vercel Dashboard

### خطأ في Prisma Client

```bash
# أعد توليد Prisma Client
npx prisma generate

# ثم أعد البناء
npm run build
```

## البنية التقنية

- **Framework**: Next.js 15 مع App Router
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **Deployment**: Vercel

## المميزات

- ✅ نظام مصادقة متكامل
- ✅ لوحة تحكم حديثة
- ✅ إدارة المستخدمين والصلاحيات
- ✅ إدارة المقالات والتصنيفات
- ✅ دعم الوضع الليلي
- ✅ تصميم متجاوب
- ✅ دعم RTL الكامل

## الدعم

للمساعدة أو الإبلاغ عن مشاكل، يرجى فتح issue على GitHub.
