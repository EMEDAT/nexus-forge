// src/components/projects/create-task-dialog.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Task } from '@/types'

interface CreateTaskDialogProps {
  projectId: string
  open: boolean
  onCloseAction: () => void
}

export function CreateTaskDialog({ 
  projectId, 
  open, 
  onCloseAction 
}: CreateTaskDialogProps) {
  const router = useRouter()
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'projectId'>>({
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: new Date(),
    assignedToId: '', 
    createdAt: new Date(), 
    completed: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      router.refresh()
      
      // Reset form and close dialog
      setNewTask({
        title: '',
        description: '',
        status: 'PENDING',
        dueDate: new Date(),
        assignedToId: '',
        createdAt: new Date(),
        completed: false
      })
      onCloseAction()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onCloseAction}>
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Create New Task
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={newTask.dueDate.toISOString().split('T')[0]}
              onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({
                ...newTask, 
                status: e.target.value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}