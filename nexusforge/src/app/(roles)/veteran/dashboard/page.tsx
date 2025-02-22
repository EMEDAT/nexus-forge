// src/app/(roles)/veteran/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Award, BookOpen, Users2, Lightbulb, Star, Calendar, FileText, Target, TrendingUp } from 'lucide-react'

// Components
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MentorshipRequestManager from '@/components/roles/veteran/MentorshipRequestManager'
import { MentorshipSettingsForm } from '@/components/roles/veteran/MentorshipSettingsForm'

// Country configurations
import { nigeriaConfig } from '@/config/countries/nigeria'
import { usConfig } from '@/config/countries/us'

interface VeteranMetrics {
  impact: {
    mentees: number
    successfulMentorships: number
    activePrograms: number
    averageRating: number
  }
  expertise: {
    specializations: string[]
    yearsOfExperience: number
    certifications: number
    publications: number
  }
  contributions: {
    workshops: number
    publications: number
    lectures: number
    researchProjects: number
  }
}

export default async function VeteranDashboardPage({
  searchParams,
}: {
  searchParams: { country?: string }
}) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      redirect('/login')
    }

    // Get country configuration
    const userCountry = searchParams.country || session.user.country
    const countryConfig = userCountry === 'NIGERIA' ? nigeriaConfig : usConfig

    // Fetch veteran's comprehensive data
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
        mentorshipsAsMentor: {
          where: { status: 'ACTIVE' },
          include: {
            mentee: true,
          },
          take: 5
        },
        projects: {
          where: { status: 'IN_PROGRESS' },
          include: {
            team: {
              include: { user: true }
            }
          },
          take: 3
        }
      }
    })

    if (!userData) {
      redirect('/login')
    }

    // Mock veteran metrics (replace with real data)
    const veteranMetrics: VeteranMetrics = {
      impact: {
        mentees: userData._count.mentorshipsAsMentor,
        successfulMentorships: 45,
        activePrograms: userData.mentorshipsAsMentor.length,
        averageRating: 4.8
      },
      expertise: {
        specializations: ['Sustainable Design', 'Urban Planning', 'Heritage Conservation'],
        yearsOfExperience: 25,
        certifications: 8,
        publications: 12
      },
      contributions: {
        workshops: 24,
        publications: 15,
        lectures: 36,
        researchProjects: 8
      }
    }

    // Get upcoming knowledge sharing events
    const upcomingEvents = await prisma.task.findMany({
      where: {
        assignedToId: session.user.id,
        completed: false,
        dueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        dueDate: 'asc'
      },
      take: 5
    })

    return (
      <div className="space-y-8">
        {/* Professional Impact Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Mentees</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {veteranMetrics.impact.mentees}
                  </h3>
                </div>
                <Users2 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-gray-500">
                  {veteranMetrics.impact.averageRating} avg rating
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Years Experience</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {veteranMetrics.expertise.yearsOfExperience}
                  </h3>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {veteranMetrics.expertise.certifications} certifications
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Publications</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {veteranMetrics.contributions.publications}
                  </h3>
                </div>
                <BookOpen className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {veteranMetrics.contributions.researchProjects} research projects
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Workshops</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {veteranMetrics.contributions.workshops}
                  </h3>
                </div>
                <Lightbulb className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-500">
                  {veteranMetrics.contributions.lectures} lectures delivered
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Column 1: Mentorship Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users2 className="h-5 w-5 mr-2" />
                  Active Mentorships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.mentorshipsAsMentor.map(mentorship => (
                    <div key={mentorship.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                        {mentorship.mentee.profileImage ? (
                          <Image
                            src={mentorship.mentee.profileImage}
                            alt={mentorship.mentee.name || ''}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200" />
                        )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{mentorship.mentee.name}</h4>
                          <p className="text-sm text-gray-500">{mentorship.mentee.role}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Next Session: {new Date(mentorship.nextSession || '').toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Sharing Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(event.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Knowledge Repository */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Knowledge Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Recent Publications */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Recent Publications</h4>
                    <div className="mt-2 space-y-2">
                    {countryConfig.publications?.map((pub, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{pub.title}</span>
                              <p className="text-gray-500">{pub.journal}</p>
                            </div>
                            <span className="text-gray-500">{pub.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Research Projects */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Research Projects</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.researchProjects?.map((project, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{project.title}</span>
                          <p className="text-gray-500 mt-1">{project.description}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              project.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workshop Materials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Workshop Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryConfig.workshops?.map((workshop, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{workshop.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{workshop.topic}</p>
                        </div>
                        <span className="text-sm text-gray-500">{workshop.date}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {workshop.participants} participants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Industry Leadership */}
          <div className="space-y-6">
            {/* Industry Trends & Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Industry Leadership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryConfig.industryTrends?.map((trend, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium">{trend.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{trend.description}</p>
                      <div className="mt-2 flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{trend.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Professional Leadership */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Professional Leadership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Committee Memberships */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Professional Committees</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.committees?.map((committee, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{committee.name}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {committee.role}
                            </span>
                          </div>
                          <p className="text-gray-500 mt-1">{committee.responsibilities}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Speaking Engagements */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium">Speaking Engagements</h4>
                    <div className="mt-2 space-y-2">
                      {countryConfig.speakingEngagements?.map((event, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{event.title}</span>
                              <p className="text-gray-500">{event.venue}</p>
                            </div>
                            <span className="text-gray-500">{event.date}</span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {event.audience} expected
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legacy Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Legacy Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryConfig.legacyProjects?.map((project, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          project.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">Impact:</span>
                          <span className="font-medium">{project.impact}</span>
                        </div>
                        {project.recognition && (
                          <div className="mt-2 flex items-center">
                            <Award className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-500">{project.recognition}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Country-Specific Contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  {countryConfig.name} Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryConfig.contributions?.map((contribution, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium">{contribution.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{contribution.description}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {contribution.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
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