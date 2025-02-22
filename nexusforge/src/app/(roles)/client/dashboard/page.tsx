// src/app/(roles)/client/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Building2, Wallet, Users2, FileText, LineChart, Clock, Target, AlertCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectRequestManager } from '@/components/roles/client/ProjectRequestManager'
import { nigeriaConfig } from '@/config/countries/nigeria'
import { usConfig } from '@/config/countries/us'
import { Country } from '@/types'
import { DashboardProject, DashboardUser, ClientMetrics, MarketInsight } from '@/types/clientDashboard'

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: { country?: string }
}) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      redirect('/login')
    }

    const userCountry = (searchParams.country || session.user.country) as Country
    const countryConfig = userCountry === 'NIGERIA' ? nigeriaConfig : usConfig

    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            projects: true,
            messages: true,
          },
        },
        projects: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                expertise: true,
                experience: true,
              }
            },
            tasks: {
              where: { completed: false }
            },
            team: {
              include: { user: true }
            }
          },
          orderBy: { updatedAt: 'desc' },
          take: 5
        }
      }
    }) as DashboardUser | null

    if (!userData) {
      redirect('/login')
    }

    const activeProjects = userData.projects.filter(p => p.status === 'IN_PROGRESS')
    const completedProjects = userData.projects.filter(p => p.status === 'COMPLETED')
    const totalBudget = userData.projects.reduce((sum: number, p: DashboardProject) => sum + (p.budget || 0), 0)
    const currentSpend = userData.projects.reduce((sum: number, p: DashboardProject) => sum + (p.actualCost || 0), 0)

    const clientMetrics: ClientMetrics = {
      projects: {
        active: activeProjects.length,
        completed: completedProjects.length,
        underReview: userData.projects.filter((p: DashboardProject) => p.status === 'REVIEW').length,
        totalBudget,
        currentSpend
      },
      architects: {
        engaged: userData.projects.filter((p: DashboardProject) => p.user).length,
        shortlisted: 3,
        reviewed: 8
      },
      timelines: {
        onTrack: activeProjects.filter((p: DashboardProject) => 
          p.tasks.every((t) => new Date(t.dueDate) > new Date())
        ).length,
        delayed: activeProjects.filter((p: DashboardProject) => 
          p.tasks.some((t) => new Date(t.dueDate) < new Date())
        ).length,
        completed: completedProjects.length
      }
    }

    const recommendedArchitects = await prisma.user.findMany({
      where: {
        role: 'PROFESSIONAL',
        country: userCountry,
        mentorshipAvailable: 'AVAILABLE'
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        expertise: true,
        experience: true,
        _count: {
          select: {
            projects: true,
            mentorshipsAsMentor: true
          }
        }
      },
      take: 5
    })

    return (
      <div className="space-y-8">
        {/* Project Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Projects</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {clientMetrics.projects.active}
                  </h3>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-gray-500">
                  {clientMetrics.timelines.onTrack} on track
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Investment</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {countryConfig.currency.symbol}
                    {clientMetrics.projects.totalBudget.toLocaleString()}
                  </h3>
                </div>
                <Wallet className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <LineChart className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">
                  {Math.round((clientMetrics.projects.currentSpend / clientMetrics.projects.totalBudget) * 100)}% utilized
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Architects Engaged</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {clientMetrics.architects.engaged}
                  </h3>
                </div>
                <Users2 className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {clientMetrics.architects.reviewed} architects reviewed
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Projects</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {clientMetrics.projects.completed}
                  </h3>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-gray-500">
                  {clientMetrics.projects.underReview} under review
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Column 1: Active Projects */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Active Projects
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
                          project.tasks.some(t => new Date(t.dueDate) < new Date())
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {project.tasks.some(t => new Date(t.dueDate) < new Date())
                            ? 'Delayed'
                            : 'On Track'
                          }
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {project.user.profileImage ? (
                            <Image
                              src={project.user.profileImage}
                              alt={project.user.name || ''}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200" />
                          )}
                          <span className="text-sm text-gray-500">{project.user.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Budget: {countryConfig.currency.symbol}
                          {(project.budget || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.projects.map(project => (
                    <div key={project.id} className="relative pl-4 pb-4 border-l-2 border-gray-200">
                      <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500" />
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Started: {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Architect Discovery */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users2 className="h-5 w-5 mr-2" />
                  Recommended Architects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedArchitects.map(architect => (
                    <div key={architect.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          {architect.profileImage ? (
                            <Image
                              src={architect.profileImage}
                              alt={architect.name || ''}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{architect.name}</h4>
                          <p className="text-sm text-gray-500">{architect.experience} years experience</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {architect.expertise.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {architect._count.projects} projects
                          </div>
                          <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Request Form */}
            <ProjectRequestManager userId={session.user.id} country={userCountry} />

            {/* Country-Specific Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {countryConfig.name} Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Building Guidelines */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Building Guidelines</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.buildingGuidelines?.map((guideline, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-start">
                            <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full mr-2" />
                            <span>{guideline.title}</span>
                          </div>
                          <p className="text-gray-500 mt-1 ml-4">{guideline.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permit Information */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Required Permits</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.permits?.map((permit, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{permit.name}</span>
                            <span className="text-gray-500">{permit.timeline}</span>
                          </div>
                          <p className="text-gray-500 mt-1">{permit.requirements}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Project Analytics */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Budget Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProjects.map(project => (
                    <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium">{project.title}</h4>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span>{Math.round((project.actualCost || 0) / (project.budget || 1) * 100)}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              (project.actualCost || 0) > (project.budget || 0)
                                ? 'bg-red-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(Math.round((project.actualCost || 0) / (project.budget || 1) * 100), 100)}%` }}
                          />
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>Spent: {countryConfig.currency.symbol}{(project.actualCost || 0).toLocaleString()}</span>
                          <span>Budget: {countryConfig.currency.symbol}{(project.budget || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Project Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeProjects
                    .filter(project => 
                      project.tasks.some(t => new Date(t.dueDate) < new Date()) ||
                      (project.actualCost || 0) > (project.budget || 0)
                    )
                    .map(project => (
                      <div key={project.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-medium">{project.title}</h4>
                        <div className="mt-2 space-y-2">
                          {project.tasks
                            .filter(t => new Date(t.dueDate) < new Date())
                            .map(task => (
                              <div key={task.id} className="text-sm text-red-600">
                                <Clock className="h-4 w-4 inline mr-1" />
                                {task.title} is overdue
                              </div>
                            ))
                          }
                          {(project.actualCost || 0) > (project.budget || 0) && (
                            <div className="text-sm text-red-600">
                              <Wallet className="h-4 w-4 inline mr-1" />
                              Project over budget by {countryConfig.currency.symbol}
                              {((project.actualCost || 0) - (project.budget || 0)).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>

            {/* Local Market Insights */}
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
                      <div className="mt-2 flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{insight.trend}</span>
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