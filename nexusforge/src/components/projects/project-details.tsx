// src\components\projects\project-details.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { EditProjectDialog } from './edit-project-dialog'
import { DeleteProjectDialog } from './delete-project-dialog'
import { Project, ProjectStatus } from '@/types'

export function ProjectDetails({ project }: { project: Project }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const statusColors: Record<ProjectStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {project.description}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`mt-1 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status as ProjectStatus]}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Timeline</p>
            <p className="mt-1">
              {new Date(project.timeline).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Budget</p>
            <p className="mt-1">
              {project.budget ? formatCurrency(project.budget) : 'Not set'}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Created by</p>
            <p className="mt-1">{project.user.name}</p>
          </div>
        </div>
      </div>

      <EditProjectDialog 
        project={project}
        open={isEditDialogOpen}
        onCloseAction={() => setIsEditDialogOpen(false)}
      />
      
      <DeleteProjectDialog
        project={project}
        open={isDeleteDialogOpen}
        onCloseAction={() => setIsDeleteDialogOpen(false)}
        onDeleteAction={() => router.push('/projects')}
      />
    </div>
  )
}