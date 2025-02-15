// src\components\dashboard\recent-activity.tsx

import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'

// Define Activity Interface
interface Activity {
  id: string
  description: string
  createdAt: Date
}

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity: Activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3"
            >
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}