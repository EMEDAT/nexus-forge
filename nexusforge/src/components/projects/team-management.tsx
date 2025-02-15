// src/components/projects/team-management.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Settings, Users, UserPlus } from 'lucide-react' // Add UserPlus
import Image from 'next/image'
import { Project, TeamMember, UserRole } from '@/types'

interface TeamManagementProps {
  project: Project
}

interface Role {
  label: string
  icon: typeof Shield | typeof Settings | typeof Users
  color: string
  permissions: string[]
}

const ROLES: Record<UserRole, Role> = {
  OWNER: {
    label: 'Owner',
    icon: Shield,
    color: 'text-purple-600',
    permissions: ['manage_team', 'manage_project', 'manage_tasks', 'view_analytics'],
  },
  ADMIN: {
    label: 'Admin',
    icon: Settings,
    color: 'text-blue-600',
    permissions: ['manage_tasks', 'view_analytics', 'add_members'],
  },
  MEMBER: {
    label: 'Member',
    icon: Users,
    color: 'text-green-600',
    permissions: ['view_tasks', 'add_comments'],
  },
  PROFESSIONAL: {
    label: 'Professional',
    icon: Users,
    color: 'text-blue-600',
    permissions: ['view_tasks', 'add_comments'],
  },
  STUDENT: {
    label: 'Student',
    icon: Users,
    color: 'text-green-600',
    permissions: ['view_tasks', 'add_comments'],
  },
  VETERAN: {
    label: 'Veteran',
    icon: Shield,
    color: 'text-purple-600',
    permissions: ['view_tasks', 'add_comments', 'mentor'],
  },
  CLIENT: {
    label: 'Client',
    icon: Users,
    color: 'text-gray-600',
    permissions: ['view_tasks', 'add_comments'],
  }
}

export function TeamManagement({ project }: TeamManagementProps) {
    const router = useRouter()
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(
        `/api/projects/${project.id}/members/${userId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        }
      )

      if (!response.ok) throw new Error('Failed to update role')
      
      router.refresh()
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const removeMember = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${project.id}/members/${userId}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) throw new Error('Failed to remove member')
      
      router.refresh()
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Team Members</h2>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>

        {/* Team List */}
        <div className="space-y-4">
          {project.team?.map((member: TeamMember) => {
            const role = ROLES[member.role]
            const RoleIcon = role.icon

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                <div className="relative h-10 w-10">
                {member.user.image ? (
                    <Image
                    src={member.user.image}
                    alt={member.user.name || 'Team member'}
                    fill
                    className="rounded-full"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                        {member.user.name?.[0] || '?'}
                    </span>
                    </div>
                )}
                </div>

                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <div className="flex items-center text-sm">
                      <RoleIcon className={`h-4 w-4 mr-1 ${role.color}`} />
                      <span>{role.label}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.user.id, e.target.value as UserRole)}
                    className="rounded-md border border-gray-300 text-sm"
                    >
                    {Object.entries(ROLES).map(([key, value]) => (
                        <option key={key} value={key}>
                        {value.label}
                        </option>
                    ))}
                    </select>
                  
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Invite Team Member</h3>
            {/* Add your invite form here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Settings Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Member Settings</h3>
            
            <div className="space-y-4">
              {/* Permissions */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Permissions</h4>
                {ROLES[selectedMember.role].permissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked
                      disabled
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{permission.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <button
                  onClick={() => removeMember(selectedMember.user.id)}
                  className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                >
                  Remove from Project
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}