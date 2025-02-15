// src/components/projects/project-reporting.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Download } from 'lucide-react'
import { Project } from '@/types'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

// Define interfaces for metrics data
interface Metric {
  label: string
  value: number
  trend: number
}

interface ProgressData {
  date: string
  completed: number
  planned: number
}

interface TeamPerformanceData {
  name: string
  tasks: number
}

interface TaskDistributionData {
  name: string
  value: number
}

interface ProjectMetrics {
  summary: Metric[]
  progressData: ProgressData[]
  teamPerformance: TeamPerformanceData[]
  taskDistribution: TaskDistributionData[]
}

interface ProjectReportingProps {
  project: Project
}

export function ProjectReporting({ project }: ProjectReportingProps) {
  const [timeRange, setTimeRange] = useState('month')
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/projects/${project.id}/metrics?timeRange=${timeRange}`
        )
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error('Error fetching metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [project.id, timeRange])

  if (loading) {
    return <div>Loading metrics...</div>
  }

  if (!metrics) {
    return <div>No metrics available</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Project Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.summary.map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm font-medium text-gray-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold">{metric.value}</p>
            <p className={`mt-2 text-sm ${
              metric.trend > 0 
                ? 'text-green-600' 
                : metric.trend < 0 
                ? 'text-red-600' 
                : 'text-gray-500'
            }`}>
              {metric.trend > 0 ? '+' : ''}{metric.trend}% from previous period
            </p>
          </div>
        ))}
      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">Project Progress</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics?.progressData}>
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
                dataKey="planned"
                stroke="#00C49F"
                name="Planned Tasks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Team Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Task Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics?.taskDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics?.taskDistribution.map((entry, index) => (
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
  )
}