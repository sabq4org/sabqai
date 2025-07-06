'use client'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  gradient?: boolean
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export default function Card({
  title,
  subtitle,
  children,
  className = '',
  gradient = false,
  icon,
  action
}: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
        hover:shadow-xl transition-all duration-300
        ${gradient ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' : ''}
        ${className}
      `}
    >
      {(title || subtitle || icon || action) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              {icon && (
                <div className="flex-shrink-0">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {action && (
              <button
                onClick={action.onClick}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
} 