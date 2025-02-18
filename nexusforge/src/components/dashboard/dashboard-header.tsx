// src/components/dashboard/dashboard-header.tsx
'use client'

import type { Session } from 'next-auth'
import { useCountry } from '@/components/country-context'
import { UserNav } from './user-nav'
import Image from 'next/image'

interface DashboardHeaderProps {
  user: Session['user']
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { countryConfig } = useCountry()
  
  return (
    <div className="flex items-center justify-between mb-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {user.name || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your architectural journey
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {countryConfig && (
          <div className="hidden md:flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src={countryConfig.flag}
                alt={`${countryConfig.name} Flag`}
                fill
                className="object-contain rounded"
              />
            </div>
            <span className="text-sm font-medium">
              {countryConfig.currency.symbol} • {countryConfig.name}
            </span>
          </div>
        )}
        <UserNav />
      </div>
    </div>
  )
}