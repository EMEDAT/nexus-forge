'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  User 
} from 'lucide-react'

// Use the same Risk interface
interface Risk {
  id: string
  title: string
  category: 'TECHNICAL' | 'FINANCIAL' | 'SCHEDULE' | 'REGULATORY' | 'SAFETY'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  probability: 'HIGH' | 'MEDIUM' | 'LOW'
  impact: string
  mitigation: string
  status: 'ACTIVE' | 'MITIGATED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

interface WorkflowStep {
  id: string
  name: string
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'
  assignedTo: {
    id: string
    name: string
    email: string
  }
  comments: {
    id: string
    text: string
    userId: string
    userName: string
    createdAt: string
  }[]
  dueDate: string
}

interface RiskWorkflowProps {
  risk: Risk
}

export function RiskWorkflow({ risk }: RiskWorkflowProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [currentStep, setCurrentStep] = useState<string>('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchWorkflowSteps = useCallback(async () => {
    try {
      const response = await fetch(`/api/risks/${risk.id}/workflow`)
      const data = await response.json()
      setSteps(data.steps)
      setCurrentStep(data.currentStepId)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching workflow steps:', error)
      setLoading(false)
    }
  }, [risk.id])

  useEffect(() => {
    fetchWorkflowSteps()
  }, [fetchWorkflowSteps])

  const handleApproval = async (stepId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/workflow-steps/${stepId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          approved,
          comment
        }),
      })

      if (!response.ok) throw new Error('Failed to update workflow step')

      await fetchWorkflowSteps()
      setComment('')
    } catch (error) {
      console.error('Error updating workflow step:', error)
    }
  }

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-6 w-6 text-red-500" />
      case 'IN_REVIEW':
        return <Clock className="h-6 w-6 text-yellow-500" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-400" />
    }
  }

  if (loading) {
    return <div>Loading workflow...</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Risk Assessment Workflow</h2>

        {/* Workflow Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative pb-8 ${
                index === steps.length - 1 ? '' : 'border-l border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start">
                <div className="absolute -left-3">
                  {getStepIcon(step.status)}
                </div>

                <div className="ml-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{step.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      step.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      step.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      step.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {step.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    Assigned to: {step.assignedTo.name}
                  </div>

                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(step.dueDate).toLocaleDateString()}
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 space-y-3">
                    {step.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons for Current Step */}
                  {currentStep === step.id && (
                    <div className="mt-4">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Add Comment
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter your comment..."
                        />
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproval(step.id, true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproval(step.id, false)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                        <button
                          onClick={() => {/* Request more information */}}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Request Info
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}