# معلومات مشروع سبق الجديد

## معلومات المشروع
- **المجلد**: `/Users/alialhazmi/Projects/sabq`
- **Next.js**: 15.3.5 مع Turbopack
- **قاعدة البيانات**: PostgreSQL على Supabase
- **Prisma**: 6.11.1

## تشغيل المشروع
```bash
cd /Users/alialhazmi/Projects/sabq
npm run dev
```

## معلومات قاعدة البيانات
- **النوع**: PostgreSQL
- **المزود**: Supabase
- **URL**: محفوظ في ملف .env

## روابط المشروع
- **الموقع**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health

## أوامر مفيدة
```bash
# توليد Prisma Client
npx prisma generate

# فتح Prisma Studio
npx prisma studio

# إيقاف المشروع
pkill -f "next dev"
```

## حالة المشروع
- يعمل على المنفذ 3000
- قاعدة البيانات: PostgreSQL/Supabase
- ✅ **نظام صلاحيات متقدم**: تم تطبيقه بنجاح!

## 🆕 نظام الصلاحيات
- **3 أدوار**: مدير، محرر، مستخدم
- **19 صلاحية**: لجميع الموارد
- **حماية API**: middleware للتحقق من الصلاحيات
- **جلسات آمنة**: نظام جلسات متقدم

## حسابات الاختبار الجديدة
| البريد | كلمة المرور | الدور |
|--------|--------------|-------|
| admin@sabq.ai | Test@123456 | مدير |
| editor@sabq.ai | Test@123456 | محرر |
| user@sabq.ai | Test@123456 | مستخدم | 