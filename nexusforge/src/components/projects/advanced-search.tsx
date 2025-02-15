// src/components/projects/advanced-search.tsx
'use client'

import { useState, FormEvent } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    assignee: searchParams.get('assignee') || '',
    dateRange: searchParams.get('dateRange') || '',
  })

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    router.push(`/projects?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignee: '',
      dateRange: '',
    })
    router.push('/projects')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full rounded-md border border-gray-300 px-4 py-2"
            />
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Status</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Priority</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={filters.assignee}
            onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Assignee</option>
            {/* Add team members dynamically */}
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Date Range</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>
  )
}