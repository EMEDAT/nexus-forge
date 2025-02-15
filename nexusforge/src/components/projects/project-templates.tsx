// src/components/projects/project-templates.tsx
'use client'

import { useState } from 'react'
import { Plus, Copy, Star, StarOff, MoreVertical } from 'lucide-react'
import Image from 'next/image'

const TEMPLATE_CATEGORIES = [
  'Residential',
  'Commercial',
  'Interior Design',
  'Landscape',
  'Renovation',
]

export function ProjectTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Templates</h2>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full ${
            selectedCategory === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          All Templates
        </button>
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="relative h-48">
            <Image
              src="/nigeria-architecture.webp"
              alt="Template Preview"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Modern Residential Project</h3>
                <p className="text-sm text-gray-500">
                  Complete workflow for residential projects
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-yellow-500">
                  <Star className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>8 Phases</span>
                <span>•</span>
                <span>24 Tasks</span>
                <span>•</span>
                <span>4 Team Roles</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Copy className="h-4 w-4 mr-2" />
                Use Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}