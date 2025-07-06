'use client'

export default function TestWidthPage() {
  return (
    <div className="p-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">اختبار العرض الكامل</h1>
        
        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            هذا مربع يجب أن يمتد على كامل عرض منطقة المحتوى
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="font-bold text-green-800 dark:text-green-200">العمود الأول</h3>
            <p className="text-green-700 dark:text-green-300 mt-2">محتوى تجريبي</p>
          </div>
          
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-lg">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-200">العمود الثاني</h3>
            <p className="text-yellow-700 dark:text-yellow-300 mt-2">محتوى تجريبي</p>
          </div>
          
          <div className="bg-purple-100 dark:bg-purple-900/20 p-6 rounded-lg">
            <h3 className="font-bold text-purple-800 dark:text-purple-200">العمود الثالث</h3>
            <p className="text-purple-700 dark:text-purple-300 mt-2">محتوى تجريبي</p>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
          <h2 className="text-xl font-bold mb-4">جدول تجريبي بالعرض الكامل</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-right p-3">العمود 1</th>
                  <th className="text-right p-3">العمود 2</th>
                  <th className="text-right p-3">العمود 3</th>
                  <th className="text-right p-3">العمود 4</th>
                  <th className="text-right p-3">العمود 5</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="border-b dark:border-gray-700">
                    <td className="p-3">بيانات {i}</td>
                    <td className="p-3">معلومات {i}</td>
                    <td className="p-3">تفاصيل {i}</td>
                    <td className="p-3">وصف {i}</td>
                    <td className="p-3">ملاحظات {i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 