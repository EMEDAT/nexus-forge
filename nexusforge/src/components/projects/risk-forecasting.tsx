// src/components/projects/risk-forecasting.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, AlertTriangle, Calendar, RefreshCw } from 'lucide-react'

const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6']

// Define interfaces for type safety
interface ForecastData {
  predictedRiskLevel: string
  riskTrend: number
  predictedCriticalRisks: number
  peakRiskPeriod: string
  trendForecast: Array<{
    date: string
    historical: number
    predicted: number
    upperBound: number
    lowerBound: number
  }>
  categoryForecast: Array<{
    name: string
    value: number
  }>
  recommendations: Array<{
    title: string
    description: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    actions?: string[]
  }>
}

export function RiskForecasting({ projectId }: { projectId: string }) {
  const [timeframe, setTimeframe] = useState<'3months' | '6months' | '1year'>('6months')
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchForecastData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/risk-forecast?timeframe=${timeframe}`
      )
      const data = await response.json()
      setForecast(data)
    } catch (error) {
      console.error('Error fetching forecast data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [timeframe, projectId])

  useEffect(() => {
    fetchForecastData()
  }, [fetchForecastData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!forecast) {
    return <div>No forecast data available</div>
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Risk Forecast & Predictions</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="3months">Next 3 Months</option>
          <option value="6months">Next 6 Months</option>
          <option value="1year">Next Year</option>
        </select>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Predicted Risk Level</p>
              <p className="text-2xl font-bold">
                {forecast.predictedRiskLevel}
              </p>
              <p className="text-sm text-gray-500">
                {forecast.riskTrend > 0 ? 'Increasing' : 'Decreasing'} trend
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Critical Risks Predicted</p>
              <p className="text-2xl font-bold">
                {forecast?.predictedCriticalRisks}
              </p>
              <p className="text-sm text-gray-500">
                in next {timeframe === '3months' ? '3' : timeframe === '6months' ? '6' : '12'} months
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Risk Peak Period</p>
              <p className="text-2xl font-bold">
                {forecast?.peakRiskPeriod}
              </p>
              <p className="text-sm text-gray-500">
                Prepare mitigation strategies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Trend Forecast */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Risk Trend Forecast</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast?.trendForecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  name="Historical"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  name="Predicted"
                />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.1}
                  name="Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.1}
                  name="Lower Bound"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Category Distribution Forecast */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4">Predicted Risk Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={forecast?.categoryForecast}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {forecast?.categoryForecast.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4">AI-Powered Recommendations</h3>
        <div className="space-y-4">
          {forecast?.recommendations.map((rec, index) => (
            <div 
              key={index}
              className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className={`p-2 rounded-full ${
                rec.priority === 'HIGH' ? 'bg-red-100' :
                rec.priority === 'MEDIUM' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                <AlertTriangle className={`h-5 w-5 ${
                  rec.priority === 'HIGH' ? 'text-red-600' :
                  rec.priority === 'MEDIUM' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
              </div>
              <div>
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                {rec.actions && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Suggested Actions:</p>
                    <ul className="list-disc list-inside text-sm text-gray-500">
                      {rec.actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}