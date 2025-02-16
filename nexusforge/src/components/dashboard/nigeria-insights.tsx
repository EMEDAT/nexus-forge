// src\components\dashboard\nigeria-insights.tsx

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NigeriaInsightsProps {
  userId: string
}

export function NigeriaInsights({ userId }: NigeriaInsightsProps) {
  // You can keep server-side console.logs if needed
  console.log('Nigeria Insights Component - User ID:', userId)

  const nigeriaArchitecturalContext = {
    buildingChallenges: [
      {
        title: 'Climate Adaptation',
        description: 'Designing for hot, humid tropical climate with sustainable solutions'
      },
      {
        title: 'Urban Density',
        description: 'Addressing rapid urbanization in cities like Lagos and Abuja'
      },
      {
        title: 'Local Material Optimization',
        description: 'Innovative use of locally sourced building materials'
      }
    ],
    localResources: [
      {
        name: 'Nigerian Institute of Architects',
        link: 'https://nia.org.ng',
        type: 'Professional Association'
      },
      {
        name: 'Architectural Association of Nigeria',
        link: 'https://aan.org.ng',
        type: 'Educational Network'
      }
    ],
    learningPaths: [
      'Sustainable Tropical Architecture',
      'Urban Design in Developing Contexts',
      'Climate-Responsive Design Techniques'
    ]
  }

  return (
    <div className="space-y-6">
      {/* Architectural Challenges Card */}
      <Card>
        <CardHeader>
          <CardTitle>Architectural Challenges in Nigeria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nigeriaArchitecturalContext.buildingChallenges.map((challenge, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <h3 className="font-semibold text-blue-700">{challenge.title}</h3>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Resources Card */}
      <Card>
        <CardHeader>
          <CardTitle>Nigerian Architectural Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nigeriaArchitecturalContext.localResources.map((resource, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                <div>
                  <h3 className="font-semibold">{resource.name}</h3>
                  <p className="text-sm text-gray-600">{resource.type}</p>
                </div>
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Visit Website
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Paths Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {nigeriaArchitecturalContext.learningPaths.map((path, index) => (
              <li 
                key={index} 
                className="flex items-center text-gray-700 bg-gray-100 p-3 rounded-lg"
              >
                <span className="mr-3">🏛️</span>
                {path}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}