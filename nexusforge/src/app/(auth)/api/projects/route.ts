// src/app/api/projects/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, timeline, budget } = await req.json()

    const project = await prisma.project.create({
      data: {
        title,
        description,
        timeline: new Date(timeline),
        budget: budget ? parseFloat(budget) : null,
        status: 'DRAFT',
        userId: session.user.id,
        country: 'OTHER', // Add a default country
      },
    });

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}