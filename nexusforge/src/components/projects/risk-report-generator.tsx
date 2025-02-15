// src/components/projects/risk-report-generator.tsx
'use client'

import { useState } from 'react'
import { 
  Download, 
  Clock,
  FileText,
  RefreshCw 
} from 'lucide-react'
import { format } from 'date-fns'

interface RiskReportGeneratorProps {
  projectId: string
}

interface ReportConfig {
  type: 'summary' | 'detailed' | 'executive'
  format: 'pdf' | 'excel' | 'word'
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'
  recipients: string[]
  sections: string[]
}

export function RiskReportGenerator({ projectId }: RiskReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'summary',
    format: 'pdf',
    frequency: 'once',
    recipients: [],
    sections: [
      'risk_summary',
      'critical_risks',
      'mitigation_progress',
      'trends',
      'recommendations'
    ]
  })

  const generateReport = async () => {
    try {
      setIsGenerating(true)
      const response = await fetch(`/api/projects/${projectId}/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportConfig),
      })

      if (!response.ok) throw new Error('Failed to generate report')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `risk-report-${format(new Date(), 'yyyy-MM-dd')}.${reportConfig.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-6">Risk Report Generator</h2>

        {/* Report Configuration */}
        <div className="space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'summary', label: 'Summary Report', icon: FileText },
                { id: 'detailed', label: 'Detailed Report', icon: FileText },
                { id: 'executive', label: 'Executive Brief', icon: FileText },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setReportConfig({
                    ...reportConfig,
                    type: type.id as ReportConfig['type']
                  })}
                  className={`p-4 border rounded-lg text-center hover:border-blue-500 ${
                    reportConfig.type === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <type.icon className="h-6 w-6 mx-auto mb-2" />
                  <span className="block text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Report Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Sections
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'risk_summary', label: 'Risk Summary' },
                { id: 'critical_risks', label: 'Critical Risks' },
                { id: 'mitigation_progress', label: 'Mitigation Progress' },
                { id: 'trends', label: 'Risk Trends' },
                { id: 'recommendations', label: 'Recommendations' },
                { id: 'attachments', label: 'Attachments' },
              ].map((section) => (
                <label
                  key={section.id}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    checked={reportConfig.sections.includes(section.id)}
                    onChange={(e) => {
                      const sections = e.target.checked
                        ? [...reportConfig.sections, section.id]
                        : reportConfig.sections.filter(s => s !== section.id)
                      setReportConfig({ ...reportConfig, sections })
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{section.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <div className="flex space-x-4">
              {[
                { id: 'pdf', label: 'PDF' },
                { id: 'excel', label: 'Excel' },
                { id: 'word', label: 'Word' },
              ].map((format) => (
                <label
                  key={format.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    value={format.id}
                    checked={reportConfig.format === format.id}
                    onChange={(e) => setReportConfig({
                      ...reportConfig,
                      format: e.target.value as ReportConfig['format']
                    })}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{format.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </button>

            <button
              onClick={() => setScheduleModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule Reports
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Schedule Automated Reports</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  value={reportConfig.frequency}
                  onChange={(e) => setReportConfig({
                    ...reportConfig,
                    frequency: e.target.value as ReportConfig['frequency']
                  })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="once">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recipients
                </label>
                <div className="mt-1 space-y-2">
                  {reportConfig.recipients.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          const newRecipients = [...reportConfig.recipients]
                          newRecipients[index] = e.target.value
                          setReportConfig({ ...reportConfig, recipients: newRecipients })
                        }}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      <button
                        onClick={() => {
                          const newRecipients = reportConfig.recipients.filter((_, i) => i !== index)
                          setReportConfig({ ...reportConfig, recipients: newRecipients })
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setReportConfig({
                      ...reportConfig,
                      recipients: [...reportConfig.recipients, '']
                    })}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Add Recipient
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setScheduleModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save schedule configuration
                    setScheduleModalOpen(false)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}