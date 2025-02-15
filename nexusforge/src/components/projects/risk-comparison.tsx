// src/components/projects/risk-comparison.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { RefreshCw } from 'lucide-react'

// Define interfaces for type safety
interface Project {
  id: string
  title: string
}

interface ComparisonMetrics {
  severityComparison: Array<{
    project: string
    high: number
    medium: number
    low: number
  }>
  categoryComparison: Array<{
    category: string
    [key: string]: number | string
  }>
  mitigationProgress: Array<{
    id: string
    title: string
    progress: number
    mitigatedCount: number
    totalRisks: number
  }>
}

export function RiskComparison() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchComparisonData = useCallback(async () => {
    if (selectedProjects.length === 0) return

    try {
      const response = await fetch('/api/risk-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds: selectedProjects }),
      })
      const data = await response.json()
      setComparisonMetrics(data)
    } catch (error) {
      console.error('Error fetching comparison data:', error)
    }
  }, [selectedProjects])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    if (selectedProjects.length > 0) {
      fetchComparisonData()
    }
  }, [selectedProjects, fetchComparisonData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Project Risk Comparison</h2>
          <div className="flex items-center space-x-4">
            <select
              multiple
              value={selectedProjects}
              onChange={(e) => setSelectedProjects(Array.from(e.target.selectedOptions, option => option.value))}
              className="rounded-md border border-gray-300 px-3 py-2"
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            <button
              onClick={fetchComparisonData}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Comparison
            </button>
          </div>
        </div>

        {comparisonMetrics && (
          <div className="grid grid-cols-2 gap-6">
            {/* Risk Severity Comparison */}
            <div className="h-80">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Risk Severity Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonMetrics.severityComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="high" fill="#EF4444" name="High" />
                  <Bar dataKey="medium" fill="#F59E0B" name="Medium" />
                  <Bar dataKey="low" fill="#10B981" name="Low" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Risk Category Radar */}
            <div className="h-80">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Risk Category Analysis</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={comparisonMetrics.categoryComparison}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis />
                  {selectedProjects.map((projectId, index) => (
                    <Radar
                      key={projectId}
                      name={projects.find(p => p.id === projectId)?.title}
                      dataKey={`project${index}`}
                      stroke={`hsl(${index * 360 / selectedProjects.length}, 70%, 50%)`}
                      fill={`hsl(${index * 360 / selectedProjects.length}, 70%, 50%)`}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Mitigation Progress */}
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Risk Mitigation Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                {comparisonMetrics.mitigationProgress.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-2">{project.title}</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>{project.mitigatedCount} of {project.totalRisks} risks mitigated</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}