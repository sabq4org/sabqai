# 🔐 نظام الصلاحيات المتقدم - مشروع سبق

## 📋 نظرة عامة

تم تطبيق نظام صلاحيات متقدم ومرن يدعم:
- ✅ الأدوار المتعددة (Roles)
- ✅ الصلاحيات التفصيلية (Permissions)
- ✅ ربط مرن بين الأدوار والصلاحيات
- ✅ حماية API Routes
- ✅ التحقق من الصلاحيات في الواجهة الأمامية

## 🗄️ هيكل قاعدة البيانات

### 1. جدول الأدوار (sabq_roles)
```sql
- id: UUID
- name: اسم الدور (admin, editor, user)
- nameAr: الاسم بالعربية
- description: وصف الدور
- isActive: حالة الدور
```

### 2. جدول الصلاحيات (sabq_permissions)
```sql
- id: UUID
- name: اسم الصلاحية
- nameAr: الاسم بالعربية
- resource: المورد (articles, users, comments, etc)
- action: الإجراء (create, read, update, delete, etc)
```

### 3. جدول ربط الأدوار بالصلاحيات (sabq_role_permissions)
```sql
- id: UUID
- roleId: معرف الدور
- permissionId: معرف الصلاحية
```

## 👥 الأدوار الافتراضية

### 1. مدير (Admin)
- جميع الصلاحيات
- إدارة كاملة للنظام

### 2. محرر (Editor)
- إدارة المقالات
- إدارة التعليقات
- الوصول للوحة التحكم
- عرض الإحصائيات

### 3. مستخدم (User)
- قراءة المقالات
- إضافة تعليقات
- قراءة التعليقات

## 🛡️ كيفية استخدام نظام الصلاحيات

### 1. في API Routes

```typescript
import { requirePermission } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  // التحقق من صلاحية واحدة
  const authResult = await requirePermission(request, 'articles', 'read')
  if (authResult instanceof NextResponse) return authResult
  
  // باقي الكود...
}
```

### 2. للتحقق من عدة صلاحيات

```typescript
import { requirePermissions } from '@/lib/auth/middleware'

const authResult = await requirePermissions(request, [
  { resource: 'articles', action: 'create' },
  { resource: 'articles', action: 'publish' }
])
```

### 3. في الواجهة الأمامية

```typescript
// التحقق من الصلاحية
const hasPermission = user.permissions?.some(
  p => p.resource === 'articles' && p.action === 'create'
)

// عرض العناصر حسب الصلاحية
{hasPermission && (
  <button>إنشاء مقال جديد</button>
)}
```

## 🔑 حسابات الاختبار

| البريد الإلكتروني | كلمة المرور | الدور | الصلاحيات |
|-------------------|--------------|-------|-----------|
| admin@sabq.ai | Test@123456 | مدير | جميع الصلاحيات |
| editor@sabq.ai | Test@123456 | محرر | إدارة المحتوى |
| user@sabq.ai | Test@123456 | مستخدم | القراءة والتعليق |

## 📝 إضافة صلاحيات جديدة

1. أضف الصلاحية في ملف `prisma/seed.ts`:
```typescript
{ 
  name: 'reports.view', 
  nameAr: 'عرض التقارير', 
  resource: 'reports', 
  action: 'view' 
}
```

2. أعد تشغيل البذر:
```bash
npm run prisma:seed
```

## 🚀 أوامر مفيدة

```bash
# توليد Prisma Client
npx prisma generate

# تطبيق التغييرات على قاعدة البيانات
npx prisma db push

# تشغيل البذر
npm run prisma:seed

# فتح Prisma Studio
npx prisma studio
```

## 🔧 الخطوات التالية المقترحة

1. **نظام تسجيل الأنشطة**: تسجيل جميع العمليات الحساسة
2. **صلاحيات ديناميكية**: إمكانية إضافة/تعديل الصلاحيات من لوحة التحكم
3. **صلاحيات على مستوى السجل**: صلاحيات خاصة لسجلات معينة
4. **مجموعات المستخدمين**: تجميع المستخدمين في فرق
5. **تفويض الصلاحيات**: السماح للمدراء بتفويض صلاحياتهم مؤقتاً

---

تم التطوير بواسطة: نظام سبق الذكي
التاريخ: ${new Date().toLocaleDateString('ar-SA')} 