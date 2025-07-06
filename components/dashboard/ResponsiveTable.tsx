'use client'

interface Column {
  key: string
  label: string
  render?: (value: any, item: any) => React.ReactNode
  className?: string
}

interface ResponsiveTableProps {
  columns: Column[]
  data: any[]
  keyField: string
  emptyMessage?: string
  loading?: boolean
}

export default function ResponsiveTable({
  columns,
  data,
  keyField,
  emptyMessage = 'لا توجد بيانات',
  loading = false
}: ResponsiveTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      {/* جدول للشاشات الكبيرة */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-right px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item[keyField] || index}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* كروت للشاشات الصغيرة */}
      <div className="md:hidden space-y-4">
        {data.map((item, index) => (
          <div
            key={item[keyField] || index}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            {columns.map((column, colIndex) => (
              <div 
                key={column.key} 
                className={`
                  ${colIndex === 0 ? 'mb-3 pb-3 border-b border-gray-200 dark:border-gray-700' : 'py-2'}
                  ${column.key === 'actions' ? 'flex justify-between items-center' : ''}
                `}
              >
                {column.key !== 'actions' && (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">
                    {column.label}
                  </span>
                )}
                <div className={column.key === 'actions' ? 'flex gap-2 mr-auto' : ''}>
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
} 