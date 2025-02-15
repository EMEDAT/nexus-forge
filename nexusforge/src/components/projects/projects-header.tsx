'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreateProjectDialog } from './create-project-dialog'

export function ProjectHeader() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and track your architectural projects
        </p>
      </div>
      
      <button
        onClick={() => setIsCreateDialogOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        New Project
      </button>

      <CreateProjectDialog 
        open={isCreateDialogOpen} 
        onCloseAction={() => setIsCreateDialogOpen(false)} 
      />
    </div>
  )
}