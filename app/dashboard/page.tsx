'use client'

import { useState } from 'react'
import UserList from '@/components/UserList'
import UserForm from '@/components/UserForm'

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUserAdded = () => {
    setShowForm(false)
    setRefreshKey(prev => prev + 1) // لتحديث قائمة المستخدمين
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">لوحة التحكم - إدارة المستخدمين</h1>
        
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'إخفاء النموذج' : 'إضافة مستخدم جديد'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md mb-8">
            <UserForm onSuccess={handleUserAdded} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <UserList key={refreshKey} />
        </div>
      </div>
    </div>
  )
} 