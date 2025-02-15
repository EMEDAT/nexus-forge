// src/app/(dashboard)/projects/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProjectList } from '@/components/projects/project-list'
import { ProjectHeader } from '@/components/projects/project-header'

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
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <ProjectHeader />
      <ProjectList projects={projects} />
    </div>
  )
}