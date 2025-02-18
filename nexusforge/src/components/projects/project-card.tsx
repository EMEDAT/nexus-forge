// src/components/projects/project-card.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { 
  Calendar, 
  FileText, 
  MoreVertical,
  Clock
} from 'lucide-react'
import { Project } from '@/types'
import { DeleteProjectDialog } from './delete-project-dialog'

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
} as const

interface ProjectCardProps {
  project: Project & {
    documents: { id: string }[]
  }
}

const formatProjectDate = (date: Date | null) => {
  return date ? new Date(date).toLocaleDateString() : 'No date set'
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <Link href={`/projects/${project.id}`}>
            <div>
              <h3 className="text-lg font-medium">{project.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {project.description}
              </p>
            </div>
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
            {project.status.replace('_', ' ')}
          </span>
          
          <div className="flex items-center text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            {project.documents.length} files
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatProjectDate(project.timeline)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </div>
        </div>
      </div>

      <DeleteProjectDialog 
        project={project}
        open={showDeleteDialog}
        onCloseAction={() => setShowDeleteDialog(false)}
        onDeleteAction={() => {
          setShowDeleteDialog(false)
          // You might want to trigger a refresh here
          window.location.reload()
        }}
      />
    </div>
  )
}