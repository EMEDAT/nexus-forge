// src/app/(auth)/register/page.tsx
import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Create an account</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Join NexusForge and connect with the architectural community
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link 
          href="/login" 
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}