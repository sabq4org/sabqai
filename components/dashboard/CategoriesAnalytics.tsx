'use client';

import React from 'react';
import { Category } from '@/types/category';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, FileText, Eye, Clock } from 'lucide-react';

interface CategoriesAnalyticsProps {
  categories: Category[];
  darkMode: boolean;
}

export default function CategoriesAnalytics({ categories, darkMode }: CategoriesAnalyticsProps) {
  // حساب البيانات للرسوم البيانية
  const categoryStats = categories.map(cat => ({
    name: cat.name_ar,
    articles: cat.articles_count || cat.article_count || 0,
    color: cat.color_hex || '#3B82F6'
  })).sort((a, b) => b.articles - a.articles).slice(0, 10);

  // بيانات للرسم الدائري - أكثر 5 تصنيفات نشاطاً
  const pieData = categoryStats.slice(0, 5);

  // إحصائيات عامة
  const totalArticles = categories.reduce((sum, cat) => sum + (cat.articles_count || cat.article_count || 0), 0);
  const activeCategories = categories.filter(cat => cat.is_active).length;
  const categoriesWithArticles = categories.filter(cat => (cat.articles_count || cat.article_count || 0) > 0).length;
  const avgArticlesPerCategory = totalArticles / (categories.length || 1);

  // بطاقة إحصائية
  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor, textColor }: any) => (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h3 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        📊 إحصائيات الاستخدام
      </h3>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FileText}
          title="إجمالي المقالات"
          value={totalArticles.toLocaleString('ar-SA')}
          subtitle="في جميع التصنيفات"
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          icon={TrendingUp}
          title="متوسط المقالات"
          value={Math.round(avgArticlesPerCategory).toLocaleString('ar-SA')}
          subtitle="لكل تصنيف"
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          icon={Eye}
          title="التصنيفات النشطة"
          value={activeCategories}
          subtitle={`من أصل ${categories.length}`}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
        <StatCard
          icon={Clock}
          title="تصنيفات بمحتوى"
          value={categoriesWithArticles}
          subtitle="تحتوي على مقالات"
          bgColor="bg-orange-100"
          textColor="text-orange-600"
        />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رسم بياني شريطي */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h4 className={`text-md font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            أكثر التصنيفات استخداماً
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
                labelStyle={{ color: darkMode ? '#F3F4F6' : '#111827' }}
              />
              <Bar dataKey="articles" name="عدد المقالات">
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* رسم دائري */}
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <h4 className={`text-md font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            توزيع المقالات حسب التصنيف
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="articles"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
                labelStyle={{ color: darkMode ? '#F3F4F6' : '#111827' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* قائمة التصنيفات التفصيلية */}
      <div className={`mt-6 rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
        <h4 className={`text-md font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          تفاصيل جميع التصنيفات
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <th className={`text-right py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>التصنيف</th>
                <th className={`text-center py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>عدد المقالات</th>
                <th className={`text-center py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>الحالة</th>
                <th className={`text-center py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>النسبة المئوية</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const percentage = totalArticles > 0 
                  ? ((category.articles_count || category.article_count || 0) / totalArticles * 100).toFixed(1)
                  : '0';
                
                return (
                  <tr key={category.id} className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-xs"
                          style={{ backgroundColor: category.color_hex }}
                        >
                          {category.icon}
                        </div>
                        <span>{category.name_ar}</span>
                      </div>
                    </td>
                    <td className={`text-center py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {(category.articles_count || category.article_count || 0).toLocaleString('ar-SA')}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        category.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>
                    <td className={`text-center py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 