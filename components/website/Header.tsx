'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, SunIcon, MoonIcon, UserIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/components/ThemeProvider'

const navigation = [
  { name: 'الرئيسية', href: '/' },
  { name: 'أخبار', href: '/news' },
  { name: 'تقارير', href: '/reports' },
  { name: 'فيديو', href: '/videos' },
  { name: 'تحليلات', href: '/analytics' },
  { name: 'الأقسام', href: '/categories' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">سبق الذكية</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 lg:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden lg:flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span>تسجيل الدخول</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ابحث عن الأخبار، التقارير، والمزيد..."
                dir="rtl"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
} 