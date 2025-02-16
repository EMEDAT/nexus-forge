// src/app/(dashboard)/projects/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectHeader } from '@/components/projects/project-header'
import type { Project } from '@/types'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      user: true,
      documents: true,
      team: {
        include: {
          user: true,
        },
      },
      tasks: true,
      risks: true,
      riskAlerts: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Type assertion to match the Project[] interface
  const typedProjects = projects as unknown as Project[]

  return (
    <div className="space-y-6">
      <ProjectHeader />
      <ProjectList projects={typedProjects} />
    </div>
  )
}