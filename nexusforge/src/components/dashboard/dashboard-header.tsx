// src/components/dashboard/dashboard-header.tsx
import { User } from '@/types'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome back, {user.name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        Here&apos;s what&apos;s happening with your architectural projects and connections.
      </p>
    </div>
  )
}