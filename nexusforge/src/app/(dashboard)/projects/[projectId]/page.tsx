// src/app/(dashboard)/projects/[projectId]/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProjectDetails } from '@/components/projects/project-details'
import { ProjectDocuments } from '@/components/projects/project-documents'
import { ProjectTeam } from '@/components/projects/project-team'
import { ProjectTimeline } from '@/components/projects/project-timeline'

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
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <ProjectDetails project={project} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProjectDocuments project={project} />
          <ProjectTimeline project={project} />
        </div>
        
        <div className="space-y-6">
          <ProjectTeam project={project} />
        </div>
      </div>
    </div>
  )
}