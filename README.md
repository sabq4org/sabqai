# سبق - منصة الأخبار الذكية

منصة إخبارية حديثة مبنية بأحدث التقنيات مع نظام مصادقة متكامل.

## المميزات

- ✅ نظام مصادقة كامل (تسجيل، دخول، JWT)
- ✅ إدارة المستخدمين (CRUD)
- ✅ قاعدة بيانات PostgreSQL مع Prisma ORM
- ✅ واجهات مستخدم حديثة وسريعة
- ✅ Next.js 15 مع App Router
- ✅ TypeScript للأمان في الكتابة
- ✅ Tailwind CSS للتصميم

## المتطلبات

- Node.js 18+ 
- PostgreSQL (يمكن استخدام Supabase)
- npm أو yarn

## التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/sabq4org/sabqai.git
cd sabqai

# تثبيت المكتبات
npm install

# إعداد قاعدة البيانات
cp .env.example .env
# قم بتعديل ملف .env وإضافة بيانات قاعدة البيانات

# تشغيل migrations
npx prisma migrate dev

# تشغيل المشروع في وضع التطوير
npm run dev
```

## البنية التقنية

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT

## هيكل المشروع

```
sabq/
├── app/                    # صفحات التطبيق
│   ├── api/               # API endpoints
│   ├── dashboard/         # لوحة التحكم
│   ├── login/            # صفحة تسجيل الدخول
│   └── register/         # صفحة التسجيل
├── components/            # المكونات
├── lib/                   # المكتبات والأدوات
├── prisma/               # مخطط قاعدة البيانات
└── public/               # الملفات العامة
```

## النشر

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sabq4org/sabqai)

### Digital Ocean

1. إنشاء App Platform app
2. ربط GitHub repository
3. إضافة متغيرات البيئة
4. تشغيل build command: `npm run build`
5. تشغيل start command: `npm start`

## المتغيرات البيئية

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## الرخصة

MIT

## المساهمة

نرحب بالمساهمات! يرجى فتح issue أو pull request.
