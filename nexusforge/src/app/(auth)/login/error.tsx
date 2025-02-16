// src\app\(auth)\login\error.tsx

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    'CredentialsSignin': 'Invalid email or password. Please try again.',
    'Default': 'An unexpected error occurred. Please try again.'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-red-600">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessages[error as string] || errorMessages['Default']}
          </p>
        </div>
        <div className="space-y-4">
          <Link 
            href="/login" 
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
          <Link 
            href="/register" 
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  )
}