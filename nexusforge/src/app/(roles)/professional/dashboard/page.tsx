// src/app/(roles)/professional/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Building2, Wallet, Users2, Clock, LineChart, Shield, Calendar, FileText, Target } from 'lucide-react'

// Components
import { User, Task, Project } from '@/types'
import { BusinessMetrics } from '@/types/professionalDashboard'
import { MarketInsight } from '@/types/clientDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


// Country configurations
import { nigeriaConfig } from '@/config/countries/nigeria'
import { usConfig } from '@/config/countries/us'


interface TaskWithProjectPreview extends Omit<Task, 'project' | 'assignedTo'> {
  project: Pick<Project, 'id' | 'title'>;
  assignedTo: Pick<User, 'id' | 'name' | 'profileImage'>;
}

export default async function ProfessionalDashboardPage({
  searchParams,
}: {
  searchParams: { country?: string };
}) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      redirect('/login')
    }

    // Get country-specific configuration
    const userCountry = searchParams.country || session.user.country
    const countryConfig = userCountry === 'NIGERIA' ? nigeriaConfig : usConfig

    // Fetch comprehensive professional data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            projects: true,
            mentorshipsAsMentor: true,
            messages: true,
          },
        },
        projects: {
          where: { status: 'IN_PROGRESS' },
          include: {
            team: { include: { user: true } },
            tasks: { where: { completed: false } }
          },
          take: 5
        },
        mentorshipsAsMentor: {
          where: { status: 'ACTIVE' },
          include: { mentee: true },
          take: 3
        }
      }
    })

    if (!userData) {
      redirect('/login')
    }

    // Get active projects with critical updates
    const activeProjects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
        status: 'IN_PROGRESS'
      },
      include: {
        tasks: {
          where: { 
            completed: false,
            dueDate: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
          }
        },
        team: {
          include: { user: true }
        },
        risks: {
          where: { status: 'ACTIVE' }
        }
      },
      take: 5
    })

    // Calculate business metrics
    const businessMetrics: BusinessMetrics = {
      revenue: {
        current: 150000,
        previous: 120000,
        projected: 180000,
        currency: countryConfig.currency.symbol,
        trend: 25
      },
      projects: {
        active: activeProjects.length,
        pipeline: 3,
        completed: 15,
        overdue: 2
      },
      compliance: {
        permits: 5,
        pendingApprovals: 2,
        expiringLicenses: 1
      }
    }

    // Get upcoming client meetings
    const upcomingMeetings = await prisma.task.findMany({
      where: {
        assignedToId: session.user.id,
        completed: false,
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        completed: true,
        createdAt: true,
        projectId: true,
        assignedToId: true,
        project: {
          select: {
            id: true,
            title: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      },
      take: 5
    }) as TaskWithProjectPreview[];

    return (
      <div className="space-y-8">
        {/* Business Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Revenue (MTD)</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {businessMetrics.revenue.currency}{businessMetrics.revenue.current.toLocaleString()}
                  </h3>
                </div>
                <Wallet className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <LineChart className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+{businessMetrics.revenue.trend}%</span>
                <span className="text-gray-500 ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Projects</p>
                  <h3 className="text-2xl font-bold mt-1">{businessMetrics.projects.active}</h3>
                </div>
                <Building2 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {businessMetrics.projects.pipeline} in pipeline
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Mentees</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {userData._count.mentorshipsAsMentor}
                  </h3>
                </div>
                <Users2 className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  Active mentorship programs
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Compliance</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {businessMetrics.compliance.pendingApprovals}
                  </h3>
                </div>
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4 flex items-center text-sm text-red-500">
                <Clock className="h-4 w-4 mr-1" />
                {businessMetrics.compliance.expiringLicenses} licenses expiring soon
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Column 1: Project Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Project Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProjects.map(project => (
                    <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.tasks.length} pending tasks
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.risks.length > 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {project.risks.length > 0 ? 'At Risk' : 'On Track'}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map(member => (
                            <div key={member.id} className="relative">
                              {member.user.profileImage ? (
                                <Image
                                  src={member.user.profileImage}
                                  alt={member.user.name || ''}
                                  width={24}
                                  height={24}
                                  className="rounded-full border-2 border-white"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white" />
                              )}
                            </div>
                          ))}
                        </div>
                        {project.team.length > 3 && (
                          <span className="text-xs text-gray-500 ml-2">
                            +{project.team.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Country-Specific Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  {countryConfig.name} Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryConfig.regulations?.map((reg, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium">{reg.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{reg.description}</p>
                      <div className="mt-2 flex items-center">
                        <div className={`px-2 py-1 rounded text-xs ${
                          reg.status === 'compliant' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Business Management */}
          <div className="space-y-6">
            {/* Revenue Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Business Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Revenue Forecast</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {businessMetrics.revenue.currency}
                        {businessMetrics.revenue.projected.toLocaleString()}
                      </span>
                      <span className="text-green-500 flex items-center">
                        <LineChart className="h-4 w-4 mr-1" />
                        +20%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-sm">Projects Completed</h4>
                      <p className="text-2xl font-bold mt-1">
                        {businessMetrics.projects.completed}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-sm">Client Retention</h4>
                      <p className="text-2xl font-bold mt-1">92%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Client Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map(meeting => (
                    <div key={meeting.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{meeting.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {meeting.project.title}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(meeting.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Project Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Building Standards */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">{countryConfig.name} Building Standards</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.buildingStandards?.map((standard, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span>{standard.name}</span>
                          </div>
                          <p className="text-gray-500 mt-1 ml-4">{standard.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Suppliers */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Verified Suppliers</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.suppliers?.map((supplier, index) => (
                        <div key={index} className="flex justify-between items-start text-sm">
                          <div>
                            <span className="font-medium">{supplier.name}</span>
                            <p className="text-gray-500">{supplier.materials.join(', ')}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            supplier.rating >= 4.5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            ★ {supplier.rating}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Professional Development & Insights */}
          <div className="space-y-6">
            {/* Mentorship Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users2 className="h-5 w-5 mr-2" />
                  Mentorship Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Active Mentees</h4>
                      <p className="text-2xl font-bold mt-1">
                        {userData._count?.mentorshipsAsMentor || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Hours Contributed</h4>
                      <p className="text-2xl font-bold mt-1">24</p>
                    </div>
                  </div>

                  {/* Active Mentorships */}
                  <div className="space-y-2">
                    {userData.mentorshipsAsMentor.map(mentorship => (
                      <div key={mentorship.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{mentorship.mentee.name}</h4>
                            <p className="text-sm text-gray-500">Started {new Date(mentorship.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Professional Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Certifications */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Certifications & Licenses</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.certifications?.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">{cert.name}</span>
                            <p className="text-gray-500">{cert.authority}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            cert.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cert.expiryDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Professional Development */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Upcoming Training</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.training?.map((item, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{item.title}</span>
                              <p className="text-gray-500">{item.provider}</p>
                            </div>
                            <span className="text-gray-500">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  {countryConfig.name} Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {Array.isArray(countryConfig.marketInsights) && countryConfig.marketInsights.map((insight: MarketInsight, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{insight.description}</p>
                      {insight.trend && (
                        <div className="mt-2 flex items-center text-sm">
                          <LineChart className="h-4 w-4 mr-1 text-green-500" />
                          <span className="text-green-500">{insight.trend}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're having trouble loading your dashboard. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh page
        </button>
      </div>
    )
  }
}