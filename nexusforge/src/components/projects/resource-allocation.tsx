// src/components/projects/resource-allocation.tsx
'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Clock, AlertTriangle, DollarSign } from 'lucide-react'
import { Project } from '@/types'

// Define resource timeline interface
interface ResourceTimelineData {
  name: string
  allocated: number
  available: number
}

interface ResourceAllocationProps {
  project: Project & {
    resourceTimeline?: ResourceTimelineData[]
  }
}

export function ResourceAllocation({ project }: ResourceAllocationProps) {
  const [timeframe, setTimeframe] = useState('month')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resource Overview Cards */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hours Allocated</p>
              <p className="text-2xl font-semibold">164.5</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }} />
            </div>
            <p className="mt-2 text-sm text-gray-500">70% of monthly capacity</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resource Conflicts</p>
              <p className="text-2xl font-semibold">3</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-red-500">
              • Overlapping assignments for Design Phase
            </p>
            <p className="text-sm text-yellow-500">
              • Limited availability for Review
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resource Cost</p>
              <p className="text-2xl font-semibold">$12,450</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Budget</span>
              <span className="font-medium">$15,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Resource Timeline */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-6">Resource Timeline</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={project.resourceTimeline || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="allocated" stackId="a" fill="#3B82F6" />
              <Bar dataKey="available" stackId="a" fill="#93C5FD" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}