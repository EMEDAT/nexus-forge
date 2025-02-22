// src/components/roles/client/ProjectRequestManager.tsx
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { Country } from '@/types'
import { nigeriaConfig } from '@/config/countries/nigeria'
import { usConfig } from '@/config/countries/us'

interface ProjectRequestManagerProps {
  userId: string;
  country: Country;
}

export function ProjectRequestManager({ userId, country }: ProjectRequestManagerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const countryConfig = country === 'NIGERIA' ? nigeriaConfig : usConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Request New Project
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium">Current Market Rates</h4>
            <p className="text-sm text-gray-500 mt-1">
              Average project budget: {countryConfig.currency.symbol}
              {countryConfig.marketInsights.budgetRange}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium">Hot Regions</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {countryConfig.marketInsights.hotRegions.map((region, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => {/* TODO: Implement project request flow */}}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isSubmitting}
          >
            Start New Project Request
          </button>
        </div>
      </CardContent>
    </Card>
  )
}