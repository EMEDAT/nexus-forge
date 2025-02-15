// src/app/api/projects/[projectId]/risks/route.ts
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

    const risks = await prisma.risk.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(risks)
  } catch (error) {
    console.error('Error fetching risks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const risk = await prisma.risk.create({
      data: {
        ...data,
        projectId: params.projectId,
        status: 'ACTIVE',
        createdById: session.user.id,
      },
    })

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Error creating risk:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}