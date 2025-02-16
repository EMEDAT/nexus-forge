// src/components/projects/project-team.tsx
import { UserPlus } from 'lucide-react'
import Image from 'next/image'
import { Project, TeamMember } from '@/types'

interface ProjectTeamProps {
  project: Project & {
    team: TeamMember[]
  }
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Project Team</h2>
          
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>

        <div className="space-y-4">
          {project.team.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-4"
            >
              <div className="relative h-10 w-10">
                {member.user.profileImage || member.user.image ? (
                  <Image
                    src={member.user.profileImage || member.user.image || '/default-profile.png'}
                    alt={member.user.name}
                    fill
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {member.user.name[0]}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="font-medium">{member.user.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}