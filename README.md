# منصة سبق الذكية 🚀

نظام إدارة محتوى متقدم مع نظام صلاحيات متطور ونظام مراقبة شامل.

## المميزات الرئيسية ✨

### 1. نظام إدارة المستخدمين والصلاحيات
- **3 أدوار أساسية**: مدير، محرر، مستخدم
- **19 صلاحية مختلفة** تغطي جميع جوانب النظام
- **حماية متقدمة** لجميع API endpoints
- **نظام جلسات آمن** مع JWT tokens

### 2. نظام إعادة تعيين كلمة المرور
- إرسال رابط آمن عبر البريد الإلكتروني
- رموز آمنة بصلاحية محدودة (ساعة واحدة)
- تصميم بريد إلكتروني احترافي باللغة العربية
- حماية من الهجمات وعدم كشف معلومات المستخدمين

### 3. نظام سجلات النشاط (Activity Logs)
- تتبع جميع الأنشطة المهمة في النظام
- معلومات شاملة (IP، User Agent، التوقيت)
- لوحة تحكم لعرض وفلترة السجلات
- إمكانية التصدير والأرشفة

### 4. لوحة تحكم متقدمة
- واجهة مستخدم حديثة وسهلة الاستخدام
- عرض الصلاحيات والإحصائيات
- روابط سريعة للوصول للميزات
- دعم كامل للغة العربية

## متطلبات التشغيل 📋

- Node.js 18+ 
- PostgreSQL (أو Supabase)
- npm أو yarn

## التثبيت والإعداد 🛠️

### 1. استنساخ المشروع
```bash
git clone https://github.com/sabq4org/sabqai.git
cd sabq
```

### 2. تثبيت التبعيات
```bash
npm install
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env` في المجلد الرئيسي:

```env
# قاعدة البيانات
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-key-change-this"

# رابط التطبيق
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# إعدادات البريد الإلكتروني (للإنتاج)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
EMAIL_FROM="noreply@sabq.ai"
```

### 4. إعداد قاعدة البيانات
```bash
# توليد Prisma Client
npx prisma generate

# تطبيق التغييرات على قاعدة البيانات
npx prisma db push

# تشغيل البيانات الأساسية (seed)
npx tsx prisma/seed.ts
```

### 5. تشغيل المشروع
```bash
npm run dev
```

المشروع سيعمل على: http://localhost:3000

## المستخدمون التجريبيون 👥

بعد تشغيل seed script، يمكنك تسجيل الدخول بأحد الحسابات التالية:

| البريد الإلكتروني | كلمة المرور | الدور |
|-------------------|--------------|-------|
| admin@sabq.ai | Test@123456 | مدير |
| editor@sabq.ai | Test@123456 | محرر |
| user@sabq.ai | Test@123456 | مستخدم |

## هيكل المشروع 📁

```
sabq/
├── app/                    # صفحات Next.js 15 (App Router)
│   ├── api/               # API endpoints
│   ├── dashboard/         # لوحة التحكم
│   └── ...                # صفحات أخرى
├── components/            # المكونات القابلة لإعادة الاستخدام
├── lib/                   # المكتبات والخدمات
│   ├── auth/             # نظام المصادقة والصلاحيات
│   ├── activity-logger.ts # نظام تسجيل الأنشطة
│   └── email.ts          # خدمة البريد الإلكتروني
├── prisma/               # Prisma Schema والـ migrations
├── docs/                 # التوثيق
└── public/               # الملفات الثابتة
```

## API Endpoints 🔌

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `POST /api/auth/forgot-password` - طلب إعادة تعيين كلمة المرور
- `POST /api/auth/reset-password` - تنفيذ إعادة التعيين

### الإدارة
- `GET /api/admin/users` - قائمة المستخدمين
- `GET /api/admin/activity-logs` - سجلات النشاط
- `GET /api/admin/roles` - قائمة الأدوار

### المستخدم
- `GET /api/user/profile` - معلومات المستخدم
- `PUT /api/user/profile` - تحديث الملف الشخصي

## الأمان 🔒

- **تشفير كلمات المرور**: bcrypt
- **JWT Tokens**: مع secret keys آمنة
- **HTTPS Only Cookies**: في بيئة الإنتاج
- **حماية CSRF**: SameSite cookies
- **Rate Limiting**: يُنصح بإضافته في الإنتاج
- **تسجيل جميع الأنشطة**: للمراجعة والتدقيق

## النشر 🚀

### Vercel
```bash
vercel --prod
```

### Digital Ocean
استخدم App Platform أو Droplet مع:
- Node.js 18+
- PostgreSQL
- Nginx (اختياري)

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

## المساهمة 🤝

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الدعم 💬

- **Issues**: [GitHub Issues](https://github.com/sabq4org/sabqai/issues)
- **Email**: support@sabq.ai
- **Documentation**: [docs/](./docs)

## الترخيص 📄

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

صُنع بـ ❤️ بواسطة فريق سبق الذكية
