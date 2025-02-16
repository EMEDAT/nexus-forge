// src/app/(auth)/api/projects/[projectId]/risk-forecast/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { Risk } from '@/types'

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get URL parameters
    const { searchParams } = new URL(req.url)
    const timeframe = searchParams.get('timeframe') || '6months'

    // Fetch historical risk data
    const historicalRisks = await prisma.risk.findMany({
      where: {
        projectId: params.projectId,
        createdAt: {
          gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // Last 6 months
        }
      },
      include: {
        createdBy: true,
        assignedTo: true,
        alerts: true,
        history: true,
      },
    })

    // Type assertion for historical risks
    const typedRisks = historicalRisks as unknown as Risk[]

    const forecast = {
      predictedRiskLevel: 'Medium',
      riskTrend: 5,
      predictedCriticalRisks: 3,
      peakRiskPeriod: 'August 2024',
      
      trendForecast: generateTrendForecast(timeframe),
      categoryForecast: generateCategoryForecast(typedRisks),
      recommendations: generateRecommendations(typedRisks),
    }

    return NextResponse.json(forecast)
  } catch (error) {
    console.error('Error generating forecast:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


function generateTrendForecast(timeframe: string) {
  // Generate mock forecast data
  const data = []
  const months = timeframe === '3months' ? 3 : timeframe === '6months' ? 6 : 12
  
  for (let i = 0; i < months; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() + i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      historical: Math.floor(Math.random() * 50) + 50,
      predicted: Math.floor(Math.random() * 50) + 50,
      upperBound: Math.floor(Math.random() * 20) + 80,
      lowerBound: Math.floor(Math.random() * 20) + 30,
    })
  }
  
  return data
}

function generateCategoryForecast(historicalRisks: any[]) {
  // Generate category distribution forecast
  return [
    { name: 'Technical', value: 35 },
    { name: 'Financial', value: 25 },
    { name: 'Schedule', value: 20 },
    { name: 'Regulatory', value: 20 },
  ]
}

function generateRecommendations(historicalRisks: any[]) {
  // Generate AI-powered recommendations
  return [
    {
      priority: 'HIGH',
      title: 'Increase Technical Risk Monitoring',
      description: 'Based on historical patterns, technical risks are likely to increase in the next quarter.',
      actions: [
        'Implement weekly technical reviews',
        'Enhance testing protocols',
        'Schedule additional quality assurance checks',
      ],
    },
    {
      priority: 'MEDIUM',
      title: 'Review Financial Contingencies',
      description: 'Predicted market fluctuations may impact project costs.',
      actions: [
        'Update budget forecasts',
        'Review supplier contracts',
        'Prepare contingency funds',
      ],
    },
    {
      priority: 'LOW',
      title: 'Update Documentation',
      description: 'Ensure all risk documentation is current and accessible.',
      actions: [
        'Review risk register',
        'Update mitigation strategies',
        'Schedule team training',
      ],
    },
  ]
}