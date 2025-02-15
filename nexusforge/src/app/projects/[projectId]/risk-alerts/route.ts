// src/app/api/projects/[projectId]/risk-alerts/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const alerts = await prisma.riskAlert.findMany({
      where: { 
        projectId: params.projectId,
        OR: [
          { userId: session.user.id },
          { risk: { assignedToId: session.user.id } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 alerts
    })

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Error fetching risk alerts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mark all alerts as read
export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.riskAlert.updateMany({
      where: {
        projectId: params.projectId,
        userId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking alerts as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}