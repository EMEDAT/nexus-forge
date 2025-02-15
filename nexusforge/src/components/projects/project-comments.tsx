// src/components/projects/project-comments.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { Send, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { Project, User } from '@/types'

// Define Comment Interface
interface Comment {
  id: string
  content: string
  user: User
  createdAt: string
  replies?: Comment[]
}

interface ProjectCommentsProps {
  project: Project & {
    comments?: Comment[]
  }
}

export function ProjectComments({ project }: ProjectCommentsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!comment.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment }),
      })

      if (!response.ok) throw new Error('Failed to post comment')

      setComment('')
      router.refresh()
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Project Discussion</h2>

        {/* Comments List */}
        <div className="space-y-6 mb-6">
          {project.comments?.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600">
                      {comment.user.name[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium">{comment.user.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>

                {/* Reply button and nested replies */}
                <div className="mt-2 ml-4">
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    Reply
                  </button>
                  {comment.replies?.map((reply) => (
                    <div key={reply.id} className="flex space-x-4 mt-4">
                      {/* Similar structure to parent comment */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmitComment} className="flex space-x-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </button>
        </form>
      </div>
    </div>
  )
}