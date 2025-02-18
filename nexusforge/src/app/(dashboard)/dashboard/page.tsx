// src/app/(dashboard)/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { UpcomingMentorship } from '@/components/dashboard/upcoming-mentorship'
import { NigeriaInsights } from '@/components/dashboard/nigeria-insights'
import Image from 'next/image'
import { User } from '@/types'

interface ExtendedUser extends User {
  _count: {
    projects: number
    mentorshipsAsMentor: number
    mentorshipsAsMentee: number
    messages: number
  }
}

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      redirect('/login')
    }

    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            projects: true,
            mentorshipsAsMentor: true,
            mentorshipsAsMentee: true,
            messages: true,
          },
        },
      },
    })

    if (!userData) {
      console.log('User data not found for ID:', session.user.id)
      redirect('/login')
    }

    // Calculate total mentorships
    const totalMentorships = 
      (userData._count?.mentorshipsAsMentor || 0) + 
      (userData._count?.mentorshipsAsMentee || 0)

    const stats = {
      _count: {
        projects: userData._count?.projects || 0,
        mentorships: totalMentorships,
        messages: userData._count?.messages || 0,
      }
    }

    const isNigerianUser = session.user.country === 'NG'

    return (
      <div className="space-y-8">
        <DashboardHeader user={session.user} />
        
        {/* Welcome Message for New Nigerian Users */}
        {userData._count.projects === 0 && (
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover "
              >
                <source src="/videos/nigerian-flag.mp4" type="video/mp4" />
              </video>
              {/* Overlay to ensure text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6">
              <h2 className="text-2xl font-bold mb-2 text-white">
                Welcome to NexusForge Nigeria, {session.user.name}!
              </h2>
              <p className="mb-4 text-white/90">Begin your Nigerian architectural journey with these steps:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">1. Complete Your Profile</h3>
                  <p className="text-sm text-white/80">Add your Nigerian education and specializations</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">2. Connect with Nigerian Mentors</h3>
                  <p className="text-sm text-white/80">Learn from experienced local architects</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-white">3. Start Local Projects</h3>
                  <p className="text-sm text-white/80">Begin with Nigerian architectural styles</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            <RecentActivity userId={session.user.id} />
          </div>
          
          {isNigerianUser && (
            <div className="space-y-6">
              <UpcomingMentorship userId={session.user.id} />
              
              {/* Nigerian Architecture Spotlight */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <Image
                  src="/images/nigeria-architecture.webp"
                  alt="Nigerian Architecture"
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Nigerian Architecture Hub</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Explore contemporary Nigerian architectural innovations
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="font-medium">🌍 Climate-Responsive Design</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">🏗️ Local Material Integration</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">🏛️ Cultural Preservation</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">🌱 Sustainable Practices</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nigerian Market Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Nigerian Market Updates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Project Budget</span>
                    <span className="font-medium">₦25M - ₦150M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Most In-Demand Skills</span>
                    <span className="font-medium">BIM, Sustainable Design</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hot Regions</span>
                    <span className="font-medium">Lagos, Abuja, PH</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isNigerianUser && (
            <div className="space-y-6">
              <NigeriaInsights userId={session.user.id} />
              
              {/* Nigerian Resources */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Local Resources</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h4 className="font-medium">Nigerian Building Codes</h4>
                    <p className="text-sm text-gray-500">Latest National Building Code</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h4 className="font-medium">Material Suppliers</h4>
                    <p className="text-sm text-gray-500">Verified Local Suppliers Directory</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h4 className="font-medium">Local Certifications</h4>
                    <p className="text-sm text-gray-500">ARCON Requirements & Updates</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    redirect('/error')
  }
}