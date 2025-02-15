// src\components\projects\delete-project-dialog.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/dialog'
import { Loader2, Trash2 } from 'lucide-react'
import { Project } from '@/types'

interface DeleteProjectDialogProps {
  project: Project
  open: boolean
  onCloseAction: () => void
  onDeleteAction: () => void
}

export function DeleteProjectDialog({ 
  project, 
  open, 
  onCloseAction, 
  onDeleteAction 
}: DeleteProjectDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      // Call the onDeleteAction callback to handle navigation or state update
      onDeleteAction()
      
      // Close the dialog
      onCloseAction()
    } catch (err) {
      console.error('Error deleting project:', err)
      setError('Failed to delete the project. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onCloseAction}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Trash2 className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-lg font-medium text-red-600">Delete Project</h2>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the project "{project.title}"? 
              This action cannot be undone and will permanently remove the project 
              and all its associated data.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCloseAction}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}