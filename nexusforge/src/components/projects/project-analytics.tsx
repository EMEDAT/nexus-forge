// src/components/projects/project-analytics.tsx
'use client'

import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Project } from '@/types'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

interface ProjectAnalyticsProps {
  project: Project & {
    tasks: Array<{
      completed: boolean
      createdAt: string
    }>
  }
}

export function ProjectAnalytics({ project }: ProjectAnalyticsProps) {
  // Calculate progress data
  const progressData = project.tasks.reduce((acc: any[], task) => {
    const date = new Date(task.createdAt).toLocaleDateString()
    const existingData = acc.find(d => d.date === date)
    
    if (existingData) {
      existingData.completed += task.completed ? 1 : 0
      existingData.total += 1
    } else {
      acc.push({
        date,
        completed: task.completed ? 1 : 0,
        total: 1,
      })
    }
    
    return acc
  }, [])

  // Calculate task status distribution
  const taskStatusData = [
    { name: 'Completed', value: project.tasks.filter(t => t.completed).length },
    { name: 'In Progress', value: project.tasks.filter(t => !t.completed).length },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Project Analytics</h2>

        <div className="space-y-8">
          {/* Progress Over Time Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Progress Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#0088FE" 
                    name="Completed Tasks" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#00C49F" 
                    name="Total Tasks" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Status Distribution */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Task Status Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}