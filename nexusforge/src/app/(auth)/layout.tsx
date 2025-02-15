// src/app/(auth)/layout.tsx
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">NexusForge</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connecting Architectural Minds
            </p>
          </div>
          {children}
        </div>
      </div>
      
      {/* Right side - Background Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        <Image
          src="/images/auth-bg.jpg"
          alt="Architecture Background"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}