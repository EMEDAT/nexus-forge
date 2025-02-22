// src/components/dashboard/dashboard-header.tsx
'use client'

import type { Session } from 'next-auth'
import { UserNav } from './user-nav'

interface DashboardHeaderProps {
  user: Session['user']
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  // Get only the first name
  const firstName = user.name?.split(' ')[0] || 'User';
  
  return (
    <div className="flex items-center justify-between mb-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your architectural journey
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <UserNav />
      </div>
    </div>
  )
}