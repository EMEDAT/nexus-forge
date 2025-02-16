// src/components/dashboard/dashboard-header.tsx
import type { Session } from 'next-auth'

interface DashboardHeaderProps {
  user: Session['user']  // Use the Session user type instead of full User type
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your architectural journey
        </p>
      </div>
    </div>
  )
}