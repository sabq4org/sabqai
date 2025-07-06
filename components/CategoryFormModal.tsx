'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  category: Category | null;
  categories: Category[];
  darkMode: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

export default function CategoryFormModal({
  isOpen,
  isEdit,
  category,
  categories,
  darkMode,
  onClose,
  onSave,
  loading
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description: '',
    slug: '',
    color_hex: '#3B82F6',
    icon: '📰',
    parent_id: null as string | null,
    position: 0,
    is_active: true,
    meta_title: '',
    meta_description: '',
    og_image_url: '',
    canonical_url: '',
    noindex: false,
    og_type: 'website'
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // ألوان وأيقونات متاحة
  const colors = [
    '#E5F1FA', '#E3FCEF', '#FFF5E5', '#FDE7F3',
    '#F2F6FF', '#FEF3C7', '#F0FDF4', '#EFF6FF',
    '#FAF5FF', '#FFF7ED', '#F9FAFB', '#F0FDFA'
  ];

  const icons = [
    '📰', '🏛️', '💼', '⚽', '🎭', '💡', '🌍', '📱',
    '🏥', '🚗', '✈️', '🏠', '🎓', '💰', '⚖️', '🔬',
    '🎨', '🎵', '📺', '🍽️', '👗', '💊', '🌱', '🔥'
  ];

  useEffect(() => {
    if (category && isEdit) {
      setFormData({
        name_ar: category.name_ar || '',
        name_en: category.name_en || '',
        description: category.description || '',
        slug: category.slug || '',
        color_hex: category.color_hex || '#3B82F6',
        icon: category.icon || '📰',
        parent_id: category.parent_id || null,
        position: category.position || 0,
        is_active: category.is_active ?? true,
        meta_title: category.meta_title || '',
        meta_description: category.meta_description || '',
        og_image_url: category.og_image_url || '',
        canonical_url: category.canonical_url || '',
        noindex: category.noindex || false,
        og_type: category.og_type || 'website'
      });
    } else {
      // Reset form for new category
      setFormData({
        name_ar: '',
        name_en: '',
        description: '',
        slug: '',
        color_hex: '#3B82F6',
        icon: '📰',
        parent_id: null,
        position: 0,
        is_active: true,
        meta_title: '',
        meta_description: '',
        og_image_url: '',
        canonical_url: '',
        noindex: false,
        og_type: 'website'
      });
    }
    setErrors({});
  }, [category, isEdit]);

  // توليد slug تلقائياً من الاسم العربي
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[أإآا]/g, 'a')
      .replace(/[ؤئي]/g, 'e')
      .replace(/[ى]/g, 'y')
      .replace(/[ة]/g, 'h')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    const newErrors: any = {};
    if (!formData.name_ar.trim()) newErrors.name_ar = 'الاسم العربي مطلوب';
    if (!formData.slug.trim()) newErrors.slug = 'الرابط مطلوب';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isEdit ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم العربي */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الاسم العربي *
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => {
                  setFormData({ ...formData, name_ar: e.target.value });
                  if (!formData.slug || formData.slug === generateSlug(formData.name_ar)) {
                    setFormData(prev => ({ 
                      ...prev, 
                      name_ar: e.target.value,
                      slug: generateSlug(e.target.value) 
                    }));
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name_ar 
                    ? 'border-red-500' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                placeholder="مثال: أخبار محلية"
              />
              {errors.name_ar && (
                <p className="text-red-500 text-sm mt-1">{errors.name_ar}</p>
              )}
            </div>

            {/* الاسم الإنجليزي */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الاسم الإنجليزي
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="مثال: Local News"
              />
            </div>

            {/* الرابط */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الرابط (Slug) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.slug 
                    ? 'border-red-500' 
                    : darkMode ? 'border-gray-600' : 'border-gray-300'
                } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                placeholder="مثال: local-news"
                dir="ltr"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>

            {/* التصنيف الأب */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                التصنيف الأب
              </label>
              <select
                value={formData.parent_id || ''}
                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
              >
                <option value="">بدون (تصنيف رئيسي)</option>
                {categories
                  .filter(cat => !cat.parent_id && cat.id !== category?.id)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ar}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* الوصف */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="وصف مختصر للتصنيف..."
              />
            </div>

            {/* اللون */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                اللون
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color_hex: color })}
                    className={`w-10 h-10 rounded-lg border-2 ${
                      formData.color_hex === color 
                        ? 'border-blue-500' 
                        : darkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* الأيقونة */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الأيقونة
              </label>
              <div className="grid grid-cols-8 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
                      formData.icon === icon 
                        ? 'border-blue-500' 
                        : darkMode ? 'border-gray-600' : 'border-gray-300'
                    } ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* الترتيب */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الترتيب
              </label>
              <input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="0"
              />
            </div>

            {/* الحالة */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                الحالة
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  نشط
                </span>
              </label>
            </div>

            {/* SEO Fields */}
            <div className="md:col-span-2">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                إعدادات SEO
              </h3>
            </div>

            {/* Meta Title */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                عنوان SEO
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="عنوان مخصص لمحركات البحث"
              />
            </div>

            {/* Meta Description */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                وصف SEO
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'
                }`}
                placeholder="وصف مخصص لمحركات البحث"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 p-6 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جارٍ الحفظ...
              </>
            ) : (
              <>
                <Save className="ml-2 h-4 w-4" />
                {isEdit ? 'حفظ التغييرات' : 'إضافة التصنيف'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 