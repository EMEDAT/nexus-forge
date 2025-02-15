// src\components\projects\activity-log.tsx

'use client'

import { useEffect, useState } from 'react'
import { Activity, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { User } from '@/types'

// Define Activity Type
interface Activity {
  id: string
  type: keyof typeof ACTIVITY_TYPES
  user: User
  description: string
  details?: string
  createdAt: string
}

const ACTIVITY_TYPES = {
  TASK_CREATED: {
    icon: Activity,
    color: 'text-blue-500',
    label: 'Task Created',
  },
  COMMENT_ADDED: {
    icon: Activity,
    color: 'text-green-500',
    label: 'Comment Added',
  },
  FILE_UPLOADED: {
    icon: Activity,
    color: 'text-purple-500',
    label: 'File Uploaded',
  },
  STATUS_CHANGED: {
    icon: Activity,
    color: 'text-orange-500',
    label: 'Status Changed',
  },
}

interface ActivityLogProps {
  projectId: string
}

export function ActivityLog({ projectId }: ActivityLogProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [projectId, page])

  const fetchActivities = async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/activities?page=${page}`
      )
      const data = await response.json()
      
      setActivities(prev => [...prev, ...data.activities])
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Activity Log</h2>

        {loading ? (
          <p>Loading activities...</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const type = ACTIVITY_TYPES[activity.type]
              const Icon = type.icon

              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4"
                >
                  <div className={`p-2 rounded-full bg-gray-100 ${type.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {activity.user.name} {activity.description}
                      </p>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {activity.details && (
                      <p className="mt-1 text-sm text-gray-500">
                        {activity.details}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}

            {hasMore && (
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-500"
              >
                Load More
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}