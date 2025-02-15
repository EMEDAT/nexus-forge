// src/components/projects/risk-mitigation-tracking.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, Clock, AlertTriangle, MoreVertical } from 'lucide-react'

interface MitigationStep {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate: string
  assignedTo: {
    id: string
    name: string
    image: string
  }
}

interface RiskMitigationTrackingProps {
  risk: {
    id: string
  }
}

export function RiskMitigationTracking({ risk }: RiskMitigationTrackingProps) {
  const [steps, setSteps] = useState<MitigationStep[]>([])
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: '',
  })

  const fetchMitigationSteps = useCallback(async () => {
    try {
      const response = await fetch(`/api/risks/${risk.id}/mitigation-steps`)
      const data = await response.json()
      setSteps(data)
    } catch (error) {
      console.error('Error fetching mitigation steps:', error)
    } finally {
      setIsLoading(false)
    }
  }, [risk.id])

  useEffect(() => {
    fetchMitigationSteps()
  }, [fetchMitigationSteps])

  const addMitigationStep = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/risks/${risk.id}/mitigation-steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStep),
      })

      if (!response.ok) throw new Error('Failed to add mitigation step')

      const addedStep = await response.json()
      setSteps([...steps, addedStep])
      setIsAddingStep(false)
      setNewStep({
        title: '',
        description: '',
        dueDate: '',
        assignedToId: '',
      })
    } catch (error) {
      console.error('Error adding mitigation step:', error)
    }
  }

  const updateStepStatus = async (stepId: string, status: MitigationStep['status']) => {
    try {
      const response = await fetch(`/api/mitigation-steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update step status')

      setSteps(steps.map(step =>
        step.id === stepId ? { ...step, status } : step
      ))
    } catch (error) {
      console.error('Error updating step status:', error)
    }
  }

  if (isLoading) {
    return <div>Loading mitigation steps...</div>
  }

  return (
    <div className="space-y-6">
      {/* Add new step button */}
      <button
        onClick={() => setIsAddingStep(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Add Mitigation Step
      </button>

      {/* Steps list */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {step.status === 'COMPLETED' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : step.status === 'IN_PROGRESS' ? (
                  <Clock className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Due: {new Date(step.dueDate).toLocaleDateString()}</span>
                    <span>Assigned to: {step.assignedTo.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={step.status}
                  onChange={(e) => updateStepStatus(step.id, e.target.value as MitigationStep['status'])}
                  className="rounded-md border border-gray-300 text-sm"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add step modal */}
      {isAddingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Add Mitigation Step</h3>
            <form onSubmit={addMitigationStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={newStep.dueDate}
                  onChange={(e) => setNewStep({ ...newStep, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  value={newStep.assignedToId}
                  onChange={(e) => setNewStep({ ...newStep, assignedToId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select team member</option>
                  {/* Add team members options dynamically */}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStep(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}