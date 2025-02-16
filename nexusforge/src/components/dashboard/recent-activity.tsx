// src/components/dashboard/recent-activity.tsx
import { prisma } from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const recentProjects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-start space-x-3"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    Created project: <span className="font-medium">{project.title}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(project.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400 mt-1">
                Start a project to see activity here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}