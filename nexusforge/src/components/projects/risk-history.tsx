'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface RiskHistoryEntry {
  id: string
  riskId: string
  previousStatus: string
  newStatus: string
  comment: string
  updatedById: string
  updatedBy: {
    name: string
    image: string
  }
  createdAt: string
}

export function RiskHistory({ riskId }: { riskId: string }) {
  const [history, setHistory] = useState<RiskHistoryEntry[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/risks/${riskId}/history`)
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Error fetching risk history:', error)
    } finally {
      setIsLoading(false)
    }
  }, [riskId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  if (isLoading) {
    return <div>Loading history...</div>
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 mr-1" />
        ) : (
          <ChevronDown className="h-4 w-4 mr-1" />
        )}
        History
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start space-x-3 text-sm"
            >
              <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{entry.updatedBy.name}</span>
                  <span className="text-gray-500">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-600">
                  Changed status from{' '}
                  <span className="font-medium">{entry.previousStatus}</span> to{' '}
                  <span className="font-medium">{entry.newStatus}</span>
                </p>
                {entry.comment && (
                  <p className="text-gray-500 mt-1">{entry.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}