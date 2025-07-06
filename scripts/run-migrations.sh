#!/bin/bash

echo "🚀 بدء تشغيل Prisma Migrations..."

# تحميل متغيرات البيئة
source .env

# توليد Prisma Client
echo "📦 توليد Prisma Client..."
npx prisma generate

# تشغيل migrations
echo "🔄 تشغيل Migrations..."
npx prisma migrate deploy

# التحقق من حالة قاعدة البيانات
echo "✅ التحقق من حالة قاعدة البيانات..."
npx prisma db pull

echo "✨ تم الانتهاء من تشغيل Migrations بنجاح!" 