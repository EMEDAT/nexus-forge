// src/components/dashboard/dashboard-stats.tsx

'use client'

import { 
    Users, 
    FolderKanban, 
    MessageSquare,
    TrendingUp 
  } from 'lucide-react'
  
  // Define an interface for stats
  interface DashboardStats {
    _count: {
      projects: number
      mentorships: number
      messages: number
    }
  }
  
  interface DashboardStatsProps {
    stats: DashboardStats
  }
  
  export function DashboardStats({ stats }: DashboardStatsProps) {
    const statItems = [
      {
        title: 'Total Projects',
        value: stats._count.projects,
        icon: FolderKanban,
        color: 'text-blue-600',
      },
      {
        title: 'Active Mentorships',
        value: stats._count.mentorships,
        icon: Users,
        color: 'text-green-600',
      },
      {
        title: 'Messages',
        value: stats._count.messages,
        icon: MessageSquare,
        color: 'text-purple-600',
      },
      {
        title: 'Project Progress',
        value: '85%',
        icon: TrendingUp,
        color: 'text-orange-600',
      },
    ]
  
    return (
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <item.icon className={`h-8 w-8 ${item.color}`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.title}
                </p>
                <p className="text-2xl font-semibold">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }