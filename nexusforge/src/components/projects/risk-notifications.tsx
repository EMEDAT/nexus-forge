// src/components/projects/risk-notifications.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, AlertTriangle, Clock, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

// Enhanced interface with more specific type definitions
interface RiskAlert {
  id: string
  type: 'HIGH_RISK' | 'DEADLINE' | 'MITIGATION_REQUIRED' | 'STATUS_CHANGE'
  title: string
  message: string
  riskId: string
  createdAt: string
  read: boolean
}

// Type for alert icons and colors
type AlertIconType = 'HIGH_RISK' | 'DEADLINE' | 'MITIGATION_REQUIRED' | 'STATUS_CHANGE'

export function RiskNotifications({ projectId }: { projectId: string }) {
  const [alerts, setAlerts] = useState<RiskAlert[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Explicitly typed icon and color mappings
  const alertIcons: Record<AlertIconType, typeof AlertTriangle> = {
    HIGH_RISK: AlertTriangle,
    DEADLINE: Clock,
    MITIGATION_REQUIRED: Shield,
    STATUS_CHANGE: Bell,
  }

  const alertColors: Record<AlertIconType, string> = {
    HIGH_RISK: 'text-red-500',
    DEADLINE: 'text-yellow-500',
    MITIGATION_REQUIRED: 'text-blue-500',
    STATUS_CHANGE: 'text-green-500',
  }

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/risk-alerts`)
      const data: RiskAlert[] = await response.json()
      setAlerts(data)
      setUnreadCount(data.filter(alert => !alert.read).length)
    } catch (error) {
      console.error('Error fetching risk alerts:', error)
      // Optionally set an error state or show a user-friendly error message
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [fetchAlerts])

  const markAsRead = async (alertId: string) => {
    try {
      await fetch(`/api/risk-alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking alert as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/projects/${projectId}/risk-alerts/mark-all-read`, {
        method: 'POST',
      })
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => ({ ...alert, read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all alerts as read:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Bell className="h-6 w-6 animate-pulse text-gray-400" />
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Risk Alerts</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No alerts at this time
                </p>
              ) : (
                alerts.map((alert: RiskAlert) => {
                  const IconComponent = alertIcons[alert.type]
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg ${
                        alert.read ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <IconComponent 
                          className={`h-5 w-5 ${alertColors[alert.type]}`} 
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{alert.title}</h4>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(alert.createdAt), { 
                                addSuffix: true 
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.message}
                          </p>
                          {!alert.read && (
                            <button
                              onClick={() => markAsRead(alert.id)}
                              className="text-sm text-blue-600 hover:text-blue-500 mt-2"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}