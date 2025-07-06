'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  FileText,
  Folder,
  Users,
  Shield,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Bell,
  User
} from 'lucide-react'

interface MenuItem {
  name: string
  href: string
  icon: any
  badge?: number
  subItems?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    name: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'المقالات',
    href: '/dashboard/articles',
    icon: FileText,
    badge: 23,
  },
  {
    name: 'التصنيفات',
    href: '/dashboard/categories',
    icon: Folder,
  },
  {
    name: 'المستخدمين',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    name: 'الصلاحيات',
    href: '/dashboard/roles',
    icon: Shield,
  },
  {
    name: 'الأنشطة',
    href: '/dashboard/activity-logs',
    icon: ClipboardList,
  },
  {
    name: 'التحليلات',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'الإعدادات',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login?logout=true')
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login?logout=true')
    }
  }

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    )
  }

  return (
    <aside className="w-72 bg-white border-l border-gray-200 shadow-xl flex flex-col h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">سبق الذكية</h1>
            <p className="text-xs text-gray-500">منصة الأخبار المتقدمة</p>
          </div>
        </Link>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{user?.name || 'المستخدم'}</h3>
            <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const isExpanded = expandedItems.includes(item.href)
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.subItems) {
                      e.preventDefault()
                      toggleExpanded(item.href)
                    }
                  }}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-l from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.subItems && (
                      isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </Link>

                {/* Sub Items */}
                {item.subItems && isExpanded && (
                  <ul className="mt-1 mr-9 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = pathname === subItem.href
                      
                      return (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                              ${isSubActive 
                                ? 'bg-blue-50 text-blue-600 font-medium' 
                                : 'text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            <SubIcon className="w-4 h-4" />
                            <span>{subItem.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
} 