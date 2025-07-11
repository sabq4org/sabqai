import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
} 