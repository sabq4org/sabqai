'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  FireIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  Activity,
  DollarSign,
  ShoppingCart,
  Package
} from 'lucide-react'
import DashboardCard from '@/components/dashboard/DashboardCard'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: any
  color: string
}

// بيانات تجريبية للرسوم البيانية
const activityData = [
  { name: 'الأحد', views: 4000, articles: 24, users: 240 },
  { name: 'الإثنين', views: 3000, articles: 18, users: 221 },
  { name: 'الثلاثاء', views: 2000, articles: 28, users: 229 },
  { name: 'الأربعاء', views: 2780, articles: 39, users: 200 },
  { name: 'الخميس', views: 1890, articles: 48, users: 218 },
  { name: 'الجمعة', views: 2390, articles: 38, users: 250 },
  { name: 'السبت', views: 3490, articles: 43, users: 210 },
]

const categoryData = [
  { name: 'أخبار محلية', value: 400, color: '#3B82F6' },
  { name: 'رياضة', value: 300, color: '#10B981' },
  { name: 'تقنية', value: 200, color: '#8B5CF6' },
  { name: 'اقتصاد', value: 150, color: '#F59E0B' },
  { name: 'ثقافة', value: 100, color: '#EF4444' },
]

const recentActivities = [
  { id: 1, user: 'أحمد محمد', action: 'نشر مقال جديد', time: 'منذ 5 دقائق', type: 'article' },
  { id: 2, user: 'سارة أحمد', action: 'علق على مقال', time: 'منذ 12 دقيقة', type: 'comment' },
  { id: 3, user: 'محمد علي', action: 'سجل دخول جديد', time: 'منذ 23 دقيقة', type: 'login' },
  { id: 4, user: 'فاطمة خالد', action: 'حدثت ملفها الشخصي', time: 'منذ 45 دقيقة', type: 'profile' },
]

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 1202,
    articles: 342,
    views: 45600,
    revenue: 12500
  })
  const router = useRouter()

  useEffect(() => {
    // جلب معلومات المستخدم
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userData)
      setUserInfo(user)
      
      // إحصائيات وهمية للعرض
      setStats({
        users: 1202,
        articles: 342,
        views: 45600,
        revenue: 12500
      })
    } catch (error) {
      console.error('خطأ في قراءة بيانات المستخدم:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* رسالة الترحيب */}
      <div className="bg-gradient-to-l from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          مرحباً بك، {userInfo?.name || 'المستخدم'} 👋
        </h1>
        <p className="text-blue-100">
          إليك نظرة عامة على أداء منصتك اليوم
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          label="إجمالي المستخدمين"
          value={stats.users.toLocaleString('ar-SA')}
          percent={4.1}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <DashboardCard
          label="المقالات المنشورة"
          value={stats.articles.toLocaleString('ar-SA')}
          percent={2.7}
          icon={<FileText className="w-6 h-6" />}
          color="green"
        />
        <DashboardCard
          label="المشاهدات اليوم"
          value={stats.views.toLocaleString('ar-SA')}
          percent={-1.2}
          icon={<Eye className="w-6 h-6" />}
          color="purple"
        />
        <DashboardCard
          label="الإيرادات"
          value={`$${stats.revenue.toLocaleString('ar-SA')}`}
          percent={8.5}
          icon={<DollarSign className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">نشاط المنصة</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
              <option>آخر 3 شهور</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Categories Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">توزيع المقالات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{category.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Top Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">آخر الأنشطة</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'article' ? 'bg-blue-100' :
                  activity.type === 'comment' ? 'bg-green-100' :
                  activity.type === 'login' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {activity.type === 'article' && <FileText className="w-5 h-5 text-blue-600" />}
                  {activity.type === 'comment' && <Activity className="w-5 h-5 text-green-600" />}
                  {activity.type === 'login' && <Users className="w-5 h-5 text-purple-600" />}
                  {activity.type === 'profile' && <Users className="w-5 h-5 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">مؤشرات الأداء</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">معدل النشر اليومي</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">تفاعل المستخدمين</span>
                <span className="text-sm font-medium text-gray-900">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">جودة المحتوى</span>
                <span className="text-sm font-medium text-gray-900">93%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">سرعة الاستجابة</span>
                <span className="text-sm font-medium text-gray-900">98%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الروابط السريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'إضافة مقال', icon: DocumentTextIcon, href: '/dashboard/articles/new', color: 'bg-blue-500' },
          { title: 'إدارة المستخدمين', icon: UsersIcon, href: '/dashboard/users', color: 'bg-green-500' },
          { title: 'الإحصائيات', icon: ChartBarIcon, href: '/dashboard/analytics', color: 'bg-purple-500' },
          { title: 'الإعدادات', icon: CogIcon, href: '/dashboard/settings', color: 'bg-gray-500' },
        ].map((link, index) => {
          const Icon = link.icon
          return (
            <button
              key={index}
              onClick={() => router.push(link.href)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group"
            >
              <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{link.title}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
} 