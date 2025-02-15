// src/components/projects/risk-analytics-dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Calendar, TrendingUp, AlertTriangle, Activity, Download } from 'lucide-react'

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B']

// Define interfaces for analytics data
interface RiskTrendData {
  date: string
  high: number
  medium: number
  low: number
}

interface CategoryDistributionData {
  name: string
  value: number
}

interface ImpactAnalysisData {
  name: string
  impact: number
  probability: number
}

interface MitigationProgressData {
  date: string
  identified: number
  mitigated: number
}

interface DetailedMetricsData {
  name: string
  current: number
  previous: number
  change: number
}

interface RiskAnalytics {
  criticalRisks: number
  criticalRisksTrend: number
  activeRisks: number
  activeProjects: number
  mitigationRate: number
  mitigatedRisks: number
  avgResolutionDays: number
  resolutionTrend: number
  riskTrend: RiskTrendData[]
  categoryDistribution: CategoryDistributionData[]
  impactAnalysis: ImpactAnalysisData[]
  mitigationProgress: MitigationProgressData[]
  detailedMetrics: DetailedMetricsData[]
}

interface RiskAnalyticsDashboardProps {
  projectId: string
}

export function RiskAnalyticsDashboard({ projectId }: RiskAnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState('month')
  const [analytics, setAnalytics] = useState<RiskAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `/api/projects/${projectId}/risk-analytics?timeframe=${timeframe}`
        )
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeframe, projectId])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return <div>No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Risk Analytics</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Critical Risks</p>
              <p className="text-2xl font-bold">{analytics.criticalRisks}</p>
              <p className={`text-sm ${
                analytics.criticalRisksTrend > 0 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}>
                {analytics.criticalRisksTrend > 0 ? '+' : ''}
                {analytics.criticalRisksTrend}% from last period
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Active Risks</p>
              <p className="text-2xl font-bold">{analytics.activeRisks}</p>
              <p className="text-sm text-gray-500">
                Across {analytics.activeProjects} projects
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Mitigation Rate</p>
              <p className="text-2xl font-bold">{analytics.mitigationRate}%</p>
              <p className="text-sm text-gray-500">
                {analytics.mitigatedRisks} risks mitigated
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Average Resolution Time</p>
              <p className="text-2xl font-bold">{analytics.avgResolutionDays}d</p>
              <p className="text-sm text-gray-500">
                {analytics.resolutionTrend}% improvement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Trend Over Time */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Risk Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.riskTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="high" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444" 
                />
                <Area 
                  type="monotone" 
                  dataKey="medium" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B" 
                />
                <Area 
                  type="monotone" 
                  dataKey="low" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Category Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Risk Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Impact Analysis */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Impact Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.impactAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="impact" fill="#3B82F6" />
                <Bar dataKey="probability" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mitigation Progress */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Mitigation Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.mitigationProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="identified" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="mitigated" 
                  stroke="#10B981" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Detailed Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.detailedMetrics.map((metric) => (
                  <tr key={metric.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {metric.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {metric.current}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {metric.previous}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${
                        metric.change > 0 
                          ? 'text-green-600' 
                          : metric.change < 0 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                      }`}>
                        {metric.change > 0 ? '+' : ''}
                        {metric.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}