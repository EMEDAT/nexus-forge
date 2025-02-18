// src/components/dashboard/upcoming-mentorship.tsx
import { prisma } from '@/lib/prisma'
import { Mentorship } from '@/types'

interface UpcomingMentorshipProps {
  userId: string
}

export async function UpcomingMentorship({ userId }: UpcomingMentorshipProps) {
  const mentorships: Mentorship[] = await prisma.mentorship.findMany({
    where: { 
      AND: [
        { mentorId: userId },
        { status: 'ACTIVE' }
      ]
    },
    include: {
      mentor: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 3,
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="font-semibold mb-4">Upcoming Mentorship Sessions</h2>
        {mentorships.length > 0 ? (
          <div className="space-y-4">
            {mentorships.map((mentorship: Mentorship) => (
              <div
                key={mentorship.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    Session with {mentorship.mentor.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {mentorship.status}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Started: {new Date(mentorship.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-2">No active mentorships</p>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Find a Mentor
            </button>
          </div>
        )}
      </div>
    </div>
  )
}