'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface DashboardCardProps {
  label: string
  value: string | number
  percent?: number
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export default function DashboardCard({ 
  label, 
  value, 
  percent, 
  icon,
  color = 'blue' 
}: DashboardCardProps) {
  const isPositive = percent && percent > 0

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          
          {percent !== undefined && (
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {Math.abs(percent)}%
              </span>
              <span className="text-xs text-gray-400 mr-1">من الأمس</span>
            </div>
          )}
        </div>

        {icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
} 