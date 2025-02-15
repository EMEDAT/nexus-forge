// src/app/(dashboard)/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UpcomingMentorship } from '@/components/dashboard/upcoming-mentorship'
import Image from 'next/image'
import { User } from '@/types'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      redirect('/login')
    }
  
    const stats = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            projects: true,
            mentorships: true,
            messages: true,
          },
        },
      },
    })
  
    const user = session.user as User
  
    return (
      <div className="space-y-8">
        <DashboardHeader user={user} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DashboardStats stats={stats} />
          <RecentActivity userId={session.user.id} />
        </div>
        
        <div className="space-y-6">
          <UpcomingMentorship userId={session.user.id} />
          
          {/* Featured Image for Nigeria */}
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/nigeria-architecture.webp"
              alt="Nigerian Architecture"
              width={600}
              height={400}
              className="object-cover w-full h-48"
            />
            <div className="p-4 bg-white dark:bg-gray-800">
              <h3 className="font-medium">Featured: Nigerian Architecture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discover the unique architectural styles and opportunities in Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}