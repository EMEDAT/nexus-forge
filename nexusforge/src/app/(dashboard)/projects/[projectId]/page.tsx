// src/app/(dashboard)/projects/[projectId]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProjectDetails } from '@/components/projects/project-details'
import { ProjectDocuments } from '@/components/projects/project-documents'
import { ProjectTeam } from '@/components/projects/project-team'
import { ProjectTimeline } from '@/components/projects/project-timeline'
import type { Project } from '@/types'

type ProjectPageParams = {
  projectId: string
}

export default async function ProjectPage({ params }: { params: ProjectPageParams }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      user: true,
      documents: true,
      team: {
        include: {
          user: true,
        },
      },
      tasks: {
        orderBy: { createdAt: 'desc' },
      },
      risks: {
        include: {
          createdBy: true,
          assignedTo: true,
        },
      },
      riskAlerts: {
        include: {
          risk: true,
          user: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  // Convert Prisma model to our Project type
  const typedProject = {
    ...project,
    risks: project.risks || [],
    riskAlerts: project.riskAlerts || [],
  } as Project

  return (
    <div className="space-y-6">
      <ProjectDetails project={typedProject} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectDocuments project={typedProject} />
          <ProjectTimeline project={typedProject} />
        </div>
        
        <div className="space-y-6">
          <ProjectTeam project={typedProject} />
        </div>
      </div>
    </div>
  )
}