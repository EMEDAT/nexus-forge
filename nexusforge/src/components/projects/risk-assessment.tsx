// src/components/projects/risk-assessment.tsx
'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Shield, Clock, AlertOctagon, Activity, ArrowUp, ArrowDown, Plus, Trash, Edit2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface Risk {
  id: string
  title: string
  category: 'TECHNICAL' | 'FINANCIAL' | 'SCHEDULE' | 'REGULATORY' | 'SAFETY'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  probability: 'HIGH' | 'MEDIUM' | 'LOW'
  impact: string
  mitigation: string
  status: 'ACTIVE' | 'MITIGATED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

const RISK_CATEGORIES = {
  TECHNICAL: { label: 'Technical', icon: Activity, color: 'text-blue-500' },
  FINANCIAL: { label: 'Financial', icon: AlertTriangle, color: 'text-yellow-500' },
  SCHEDULE: { label: 'Schedule', icon: Clock, color: 'text-purple-500' },
  REGULATORY: { label: 'Regulatory', icon: Shield, color: 'text-green-500' },
  SAFETY: { label: 'Safety', icon: AlertOctagon, color: 'text-red-500' },
}

const SEVERITY_LEVELS = {
  HIGH: { color: 'bg-red-100 text-red-800', borderColor: 'border-red-200' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800', borderColor: 'border-yellow-200' },
  LOW: { color: 'bg-green-100 text-green-800', borderColor: 'border-green-200' },
}

export function RiskAssessment({ projectId }: { projectId: string }) {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [activeRisk, setActiveRisk] = useState<Risk | null>(null)
  const [isAddingRisk, setIsAddingRisk] = useState(false)
  const [filter, setFilter] = useState({ category: 'ALL', severity: 'ALL' })

  const [newRisk, setNewRisk] = useState({
    title: '',
    category: 'TECHNICAL',
    severity: 'MEDIUM',
    probability: 'MEDIUM',
    impact: '',
    mitigation: '',
  })

  useEffect(() => {
    fetchRisks()
  }, [projectId])

  const fetchRisks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/risks`)
      const data = await response.json()
      setRisks(data)
    } catch (error) {
      console.error('Error fetching risks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRisk = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/projects/${projectId}/risks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRisk),
      })

      if (!response.ok) throw new Error('Failed to add risk')

      const addedRisk = await response.json()
      setRisks([...risks, addedRisk])
      setIsAddingRisk(false)
      setNewRisk({
        title: '',
        category: 'TECHNICAL',
        severity: 'MEDIUM',
        probability: 'MEDIUM',
        impact: '',
        mitigation: '',
      })
    } catch (error) {
      console.error('Error adding risk:', error)
    }
  }

  const updateRiskStatus = async (riskId: string, status: Risk['status']) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/risks/${riskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update risk status')

      setRisks(risks.map(risk => 
        risk.id === riskId ? { ...risk, status } : risk
      ))
    } catch (error) {
      console.error('Error updating risk status:', error)
    }
  }

  const deleteRisk = async (riskId: string) => {
    if (!confirm('Are you sure you want to delete this risk?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}/risks/${riskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete risk')

      setRisks(risks.filter(risk => risk.id !== riskId))
    } catch (error) {
      console.error('Error deleting risk:', error)
    }
  }

  const filteredRisks = risks.filter(risk => {
    if (filter.category !== 'ALL' && risk.category !== filter.category) return false
    if (filter.severity !== 'ALL' && risk.severity !== filter.severity) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Risk Matrix Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">High Risks</h3>
              <p className="text-3xl font-bold text-red-600">
                {risks.filter(r => r.severity === 'HIGH' && r.status === 'ACTIVE').length}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Medium Risks</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {risks.filter(r => r.severity === 'MEDIUM' && r.status === 'ACTIVE').length}
              </p>
            </div>
            <Activity className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Mitigated Risks</h3>
              <p className="text-3xl font-bold text-green-600">
                {risks.filter(r => r.status === 'MITIGATED').length}
              </p>
            </div>
            <Shield className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Risk Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="ALL">All Categories</option>
            {Object.entries(RISK_CATEGORIES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="ALL">All Severities</option>
            {Object.keys(SEVERITY_LEVELS).map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddingRisk(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Risk
        </button>
      </div>

      {/* Risk List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <AnimatePresence>
            {filteredRisks.map((risk) => (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 last:mb-0"
              >
                <div className={`border rounded-lg p-4 ${SEVERITY_LEVELS[risk.severity].borderColor}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          SEVERITY_LEVELS[risk.severity].color
                        }`}>
                          {risk.severity}
                        </span>
                        {risk.status === 'MITIGATED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Mitigated
                          </span>
                        )}
                      </div>
                      <h4 className="mt-2 font-medium">{risk.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">{risk.impact}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveRisk(risk)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteRisk(risk.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {activeRisk?.id === risk.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-2">Mitigation Strategy</h5>
                      <p className="text-sm text-gray-600">{risk.mitigation}</p>
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={() => updateRiskStatus(risk.id, 'MITIGATED')}
                          className="text-sm text-green-600 hover:text-green-500"
                        >
                          Mark as Mitigated
                        </button>
                        <button
                          onClick={() => setActiveRisk(null)}
                          className="text-sm text-gray-500 hover:text-gray-400"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Risk Modal */}
      {isAddingRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium mb-4">Add New Risk</h3>
            <form onSubmit={addRisk} className="space-y-4">
              {/* Form fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newRisk.title}
                    onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newRisk.category}
                    onChange={(e) => setNewRisk({ ...newRisk, category: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    {Object.entries(RISK_CATEGORIES).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Severity</label>
                  <select
                    value={newRisk.severity}
                    onChange={(e) => setNewRisk({ ...newRisk, severity: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    {Object.keys(SEVERITY_LEVELS).map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Probability</label>
                  <select
                    value={newRisk.probability}
                    onChange={(e) => setNewRisk({ ...newRisk, probability: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700">Impact</label>
               <textarea
                 value={newRisk.impact}
                 onChange={(e) => setNewRisk({ ...newRisk, impact: e.target.value })}
                 rows={3}
                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                 placeholder="Describe the potential impact of this risk"
                 required
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">Mitigation Strategy</label>
               <textarea
                 value={newRisk.mitigation}
                 onChange={(e) => setNewRisk({ ...newRisk, mitigation: e.target.value })}
                 rows={3}
                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                 placeholder="Describe how this risk will be mitigated"
                 required
               />
             </div>

             <div className="flex justify-end space-x-3 pt-4">
               <button
                 type="button"
                 onClick={() => setIsAddingRisk(false)}
                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
               >
                 Cancel
               </button>
               <button
                 type="submit"
                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
               >
                 Add Risk
               </button>
             </div>
           </form>
         </div>
       </div>
     )}

     {/* Risk Matrix Visualization */}
     <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
       <h3 className="text-lg font-medium mb-4">Risk Matrix</h3>
       <div className="grid grid-cols-4 gap-2">
         <div className="col-span-1"></div>
         <div className="text-center font-medium text-sm text-gray-600">Low Impact</div>
         <div className="text-center font-medium text-sm text-gray-600">Medium Impact</div>
         <div className="text-center font-medium text-sm text-gray-600">High Impact</div>

         {['HIGH', 'MEDIUM', 'LOW'].map((probability) => (
           <React.Fragment key={probability}>
             <div className="font-medium text-sm text-gray-600">{probability} Probability</div>
             {['LOW', 'MEDIUM', 'HIGH'].map((impact) => {
               const cellRisks = risks.filter(
                 r => r.probability === probability && r.severity === impact && r.status === 'ACTIVE'
               )
               const bgColor = 
                 probability === 'HIGH' && impact === 'HIGH' ? 'bg-red-100' :
                 probability === 'HIGH' || impact === 'HIGH' ? 'bg-yellow-100' :
                 'bg-green-100'

               return (
                 <div
                   key={`${probability}-${impact}`}
                   className={`${bgColor} rounded-lg p-2 min-h-[80px] flex items-center justify-center`}
                 >
                   {cellRisks.length > 0 && (
                     <span className="text-lg font-bold">{cellRisks.length}</span>
                   )}
                 </div>
               )
             })}
           </React.Fragment>
         ))}
       </div>
     </div>

     {/* Risk Trends */}
     <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
       <h3 className="text-lg font-medium mb-4">Risk Trends</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <h4 className="text-sm font-medium text-gray-500 mb-2">Trending Up</h4>
           {risks
             .filter(r => r.status === 'ACTIVE' && r.severity === 'HIGH')
             .slice(0, 3)
             .map(risk => (
               <div key={risk.id} className="flex items-center space-x-2 text-red-600 mb-2">
                 <ArrowUp className="h-4 w-4" />
                 <span className="text-sm">{risk.title}</span>
               </div>
             ))}
         </div>
         <div>
           <h4 className="text-sm font-medium text-gray-500 mb-2">Trending Down</h4>
           {risks
             .filter(r => r.status === 'MITIGATED')
             .slice(0, 3)
             .map(risk => (
               <div key={risk.id} className="flex items-center space-x-2 text-green-600 mb-2">
                 <ArrowDown className="h-4 w-4" />
                 <span className="text-sm">{risk.title}</span>
               </div>
             ))}
         </div>
       </div>
     </div>
   </div>
 )
}