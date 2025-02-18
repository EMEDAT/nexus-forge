// src\components\projects\create-project-dialog.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  timeline: z.string().min(1, 'Timeline is required'),
  budget: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
  buildingType: z.string().min(1, 'Building type is required'),
})

type ProjectFormData = z.infer<typeof projectSchema>

interface CreateProjectDialogProps {
  open: boolean
  onCloseAction: () => void
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
]

const BUILDING_TYPES = [
  'Residential - Single Family',
  'Residential - Multi Family',
  'Commercial - Office',
  'Commercial - Retail',
  'Industrial',
  'Educational',
  'Healthcare',
  'Religious',
  'Mixed Use',
  'Cultural'
]

export function CreateProjectDialog({ 
  open, 
  onCloseAction 
}: CreateProjectDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [lgas, setLgas] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      reset()
      onCloseAction()
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onCloseAction}>
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Project Title
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                State
              </label>
              <select
                {...register('state')}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Local Government Area
              </label>
              <input
                {...register('lga')}
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter LGA"
              />
              {errors.lga && (
                <p className="mt-1 text-sm text-red-600">{errors.lga.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Building Type
              </label>
              <select
                {...register('buildingType')}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Building Type</option>
                {BUILDING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.buildingType && (
                <p className="mt-1 text-sm text-red-600">{errors.buildingType.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Project description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Timeline
              </label>
              <input
                {...register('timeline')}
                type="date"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.timeline && (
                <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Budget (₦)
              </label>
              <input
                {...register('budget')}
                type="number"
                step="1000"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter budget in Naira"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}