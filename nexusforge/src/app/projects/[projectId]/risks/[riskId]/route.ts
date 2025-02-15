// src/app/api/projects/[projectId]/risks/[riskId]/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  req: Request,
  { params }: { params: { projectId: string; riskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    
    // Create risk history entry
    await prisma.riskHistory.create({
      data: {
        riskId: params.riskId,
        updatedById: session.user.id,
        previousStatus: data.previousStatus,
        newStatus: data.status,
        comment: data.comment || '',
      },
    })

    // Update risk
    const risk = await prisma.risk.update({
      where: { id: params.riskId },
      data: {
        status: data.status,
        severity: data.severity,
        probability: data.probability,
        mitigation: data.mitigation,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Error updating risk:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string; riskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.risk.delete({
      where: { id: params.riskId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting risk:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}