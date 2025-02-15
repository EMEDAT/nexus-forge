'use client'

import { useState } from 'react'
import { 
  FileText, 
  History,
  Download,
  Upload,
  Clock,
  Check,
  AlertTriangle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Document } from '@/types'

// Define Version interface
interface DocumentVersion {
  id: string
  version: number
  fileUrl: string
  createdAt: Date
  isCurrent: boolean
}

interface FileVersionControlProps {
  document: Document & {
    versions?: DocumentVersion[]
  }
}

export function FileVersionControl({ document }: FileVersionControlProps) {
  const [isVersioningOpen, setIsVersioningOpen] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  const handleVersionDownload = async (version: DocumentVersion) => {
    try {
      // Clear any previous errors
      setDownloadError(null)

      // Fetch the file
      const response = await fetch(version.fileUrl)
      
      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      // Get the file blob
      const blob = await response.blob()

      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      
      // Determine filename
      const filename = `${document.title}_v${version.version}${getFileExtension(document.type)}`
      
      link.href = downloadUrl
      link.download = filename
      
      // Append to body, click, and remove
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
      setDownloadError('Failed to download file. Please try again.')
    }
  }

  // Helper function to get file extension based on document type
  const getFileExtension = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'pdf': return '.pdf'
      case 'doc':
      case 'docx': return '.docx'
      case 'xls':
      case 'xlsx': return '.xlsx'
      case 'image': return '.png'
      default: return ''
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsVersioningOpen(!isVersioningOpen)}
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        <History className="h-5 w-5" />
      </button>

      {isVersioningOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-4">
            <h3 className="font-medium mb-4">Version History</h3>
            
            {downloadError && (
              <div className="mb-4 flex items-center text-red-600 bg-red-50 p-3 rounded">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{downloadError}</span>
              </div>
            )}
            
            <div className="space-y-4">
              {!document.versions || document.versions.length === 0 ? (
                <p className="text-center text-gray-500">No version history available</p>
              ) : (
                document.versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Version {version.version}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {version.isCurrent && (
                        <span className="flex items-center text-green-600 text-sm">
                          <Check className="h-4 w-4 mr-1" />
                          Current
                        </span>
                      )}
                      <button 
                        onClick={() => handleVersionDownload(version)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Upload New Version */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload New Version
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        // Create form data for upload
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('documentId', document.id)
                        formData.append('version', ((document.versions?.length || 0) + 1).toString())

                        // Send file to server
                        const response = await fetch('/api/documents/upload', {
                          method: 'POST',
                          body: formData
                        })

                        if (!response.ok) {
                          throw new Error('File upload failed')
                        }

                        // Optionally, refresh the component or show success message
                        alert('File uploaded successfully!')
                      } catch (error) {
                        console.error('Upload error:', error)
                        alert('Failed to upload file')
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}