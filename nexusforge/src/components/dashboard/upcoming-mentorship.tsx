// src/components/dashboard/upcoming-mentorship.tsx
import { prisma } from '@/lib/prisma'
import { User } from '@/types'

// Define Mentorship Interface
interface Mentorship {
  id: string
  mentor: User
  mentee: User
  nextSession: Date
  status: string
}

interface UpcomingMentorshipProps {
  userId: string
}

export async function UpcomingMentorship({ userId }: UpcomingMentorshipProps) {
  const mentorships = await prisma.mentorship.findMany({
    where: { 
      OR: [
        { mentorId: userId },
        { menteeId: userId }
      ],
      status: 'ACTIVE'
    },
    include: {
      mentor: true,
      mentee: true,
    },
    take: 3,
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="font-semibold mb-4">Upcoming Mentorship Sessions</h2>
        <div className="space-y-4">
          {mentorships.map((mentorship: Mentorship) => (
            <div
              key={mentorship.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {mentorship.mentor.id === userId 
                    ? `Session with ${mentorship.mentee.name}`
                    : `Session with ${mentorship.mentor.name}`
                  }
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(mentorship.nextSession).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}