// src/components/projects/risk-report.tsx
'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

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

interface RiskReportProps {
  risks: Risk[]
}

const COLORS = ['#EF4444', '#F59E0B', '#10B981']

export function RiskReport({ risks }: RiskReportProps) {
  const [timeframe, setTimeframe] = useState('all')
  const [reportType, setReportType] = useState('summary')

  const generatePDF = async () => {
    try {
      const response = await fetch('/api/reports/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risks,
          timeframe,
          reportType,
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'risk-report.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const calculateMetrics = () => {
    const total = risks.length
    const active = risks.filter((r: Risk) => r.status === 'ACTIVE').length
    const mitigated = risks.filter((r: Risk) => r.status === 'MITIGATED').length
    const highSeverity = risks.filter((r: Risk) => r.severity === 'HIGH').length
    
    return {
      total,
      active,
      mitigated,
      highSeverity,
      mitigationRate: ((mitigated / total) * 100).toFixed(1),
    }
  }

  const metrics = calculateMetrics()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Risk Report</h3>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5"
          >
            <option value="all">All Time</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
            <option value="year">Past Year</option>
          </select>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5"
          >
            <option value="summary">Summary</option>
            <option value="detailed">Detailed</option>
            <option value="trends">Trends</option>
          </select>

          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Risks</p>
          <p className="text-2xl font-bold">{metrics.total}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Risks</p>
          <p className="text-2xl font-bold text-yellow-600">{metrics.active}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-500">Mitigated</p>
          <p className="text-2xl font-bold text-green-600">{metrics.mitigated}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <p className="text-sm text-gray-500">Mitigation Rate</p>
          <p className="text-2xl font-bold">{metrics.mitigationRate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-4">Risk Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'High', value: risks.filter(r => r.severity === 'HIGH').length },
                    { name: 'Medium', value: risks.filter(r => r.severity === 'MEDIUM').length },
                    { name: 'Low', value: risks.filter(r => r.severity === 'LOW').length },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-4">Risk Trends</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Technical', value: risks.filter(r => r.category === 'TECHNICAL').length },
                  { name: 'Financial', value: risks.filter(r => r.category === 'FINANCIAL').length },
                  { name: 'Schedule', value: risks.filter(r => r.category === 'SCHEDULE').length },
                  { name: 'Regulatory', value: risks.filter(r => r.category === 'REGULATORY').length },
                  { name: 'Safety', value: risks.filter(r => r.category === 'SAFETY').length },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}