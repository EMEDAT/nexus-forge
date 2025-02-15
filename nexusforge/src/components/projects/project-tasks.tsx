// src/components/projects/project-tasks.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, CheckCircle2, Circle } from 'lucide-react'
import { CreateTaskDialog } from './create-task-dialog'
import { Project } from '@/types'

export function ProjectTasks({ project }: { project: Project }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const router = useRouter()

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      router.refresh()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Tasks</h2>
          
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {project.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTaskStatus(task.id, task.status === 'COMPLETED')}
                  className="flex-shrink-0"
                >
                  {task.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                <div>
                  <p className={`font-medium ${
                    task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''
                  }`}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CreateTaskDialog
        projectId={project.id}
        open={isCreateDialogOpen}
        onCloseAction={() => setIsCreateDialogOpen(false)}
      />
    </div>
  )
}