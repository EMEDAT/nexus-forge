// src/components/projects/service-integrations.tsx
'use client'

import { useState } from 'react'
import { 
  Code2, // for GitHub
  Palette, // for Figma
  Layout, // for Trello (corrected from LayoutBoard)
  MessageCircle, // for Slack
  Link2, 
  CheckCircle,
  LucideIcon
} from 'lucide-react'

interface Service {
  id: string
  name: string
  icon: LucideIcon
  description: string
  status: 'connected' | 'disconnected'
  fields: string[]
}

const SERVICES: Service[] = [
  {
    id: 'github',
    name: 'GitHub',
    icon: Code2,
    description: 'Connect your repositories for version control',
    status: 'connected',
    fields: ['repository_url', 'branch'],
  },
  {
    id: 'figma',
    name: 'Figma',
    icon: Palette,
    description: 'Link your design files and prototypes',
    status: 'disconnected',
    fields: ['project_url', 'team_id'],
  },
  {
    id: 'trello',
    name: 'Trello',
    icon: Layout,
    description: 'Sync project tasks and boards',
    status: 'connected',
    fields: ['board_id', 'list_names'],
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageCircle,
    description: 'Get notifications and updates in your workspace',
    status: 'disconnected',
    fields: ['channel', 'webhook_url'],
  },
]

export function ServiceIntegrations() {
  const [configuring, setConfiguring] = useState<Service | null>(null)

  const handleConnect = async (service: Service) => {
    try {
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: service.id }),
      })

      if (!response.ok) throw new Error('Failed to connect service')
      
      // Add service to connected services
      setConfiguring(null)
      // Refresh services list or update status
    } catch (error) {
      console.error('Error connecting service:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Integrations</h2>

        <div className="space-y-4">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <service.icon className="h-8 w-8" />
                  <div>
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {service.status === 'connected' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm text-green-500">Connected</span>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect(service)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Modal */}
      {configuring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">
              Configure {configuring.name} Integration
            </h3>

            <form className="space-y-4">
              {configuring.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.replace('_', ' ').charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setConfiguring(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Connect Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}