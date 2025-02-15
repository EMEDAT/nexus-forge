// src/components/projects/project-documents.tsx
'use client'

import { useState } from 'react'
import { FileText, Upload, Download, Trash } from 'lucide-react'
import { formatBytes, formatDate } from '@/lib/utils'
import { Project, Document } from '@/types'

export function ProjectDocuments({ project }: { project: Project }) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', project.id)

      const response = await fetch('/api/projects/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')
      
      // Refresh the page to show new document
      window.location.reload()
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Project Documents</h2>
          
          <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload File
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {project.documents.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            No documents uploaded yet
          </p>
        ) : (
          <div className="space-y-4">
            {project.documents.map((document: Document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{document.title}</p>
                    <p className="text-sm text-gray-500">
                      {formatBytes(document.size)} • {formatDate(document.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-500">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}