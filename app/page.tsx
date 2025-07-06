import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">مرحباً بك في سبق</h1>
        <p className="text-xl text-gray-600 mb-8">نظام إدارة المحتوى الحديث</p>
        
        <div className="space-x-4 space-x-reverse">
          <Link
            href="/login"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            إنشاء حساب جديد
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-blue-500 hover:underline"
          >
            الذهاب إلى لوحة التحكم ←
          </Link>
        </div>
      </div>
    </div>
  )
}
