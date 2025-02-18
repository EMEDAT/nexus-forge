// src/app/api/projects/[projectId]/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
      select: {
        userId: true,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this project' },
        { status: 403 }
      )
    }

    // Delete the project
    await prisma.project.delete({
      where: {
        id: params.projectId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}