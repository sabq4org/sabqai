# متغيرات البيئة المطلوبة

يجب تعيين المتغيرات التالية في Vercel Dashboard:

## قاعدة البيانات

```
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-ID]:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres"
```

- احصل على هذا من Supabase Dashboard > Settings > Database
- تأكد من استخدام connection string الصحيح مع المنفذ 5432

## JWT Secret

```
JWT_SECRET="your-secure-random-string"
```

- يجب أن يكون نص عشوائي طويل وآمن
- يمكن توليده باستخدام: `openssl rand -base64 32`

## إعدادات Next.js (اختياري)

```
NEXT_PUBLIC_APP_URL="https://jur3a.ai"
NODE_ENV="production"
```

## كيفية إضافة المتغيرات في Vercel:

1. اذهب إلى Vercel Dashboard
2. اختر مشروعك
3. اذهب إلى Settings > Environment Variables
4. أضف كل متغير مع قيمته
5. تأكد من اختيار البيئات المناسبة (Production/Preview/Development)
6. احفظ التغييرات
7. أعد نشر المشروع (Redeploy)

## ملاحظات مهمة:

- تأكد من عدم وجود مسافات في بداية أو نهاية القيم
- تأكد من أن DATABASE_URL يحتوي على كلمة المرور الصحيحة
- في حالة Supabase، تأكد من أن قاعدة البيانات نشطة وغير متوقفة 