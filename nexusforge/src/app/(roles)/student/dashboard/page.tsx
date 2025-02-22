// src/app/(roles)/student/dashboard/page.tsx
import React from 'react';
import Image from 'next/image';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BookOpen, CalendarDays, CheckCircle2, Star, TrendingUp, Users } from 'lucide-react'

// Components
import { MentorAvailability, MentorshipPreferences } from '@/types/mentorship';
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import MentorDiscoveryCard from '@/components/roles/student/MentorDiscoveryCard';
import { StudentProjectList } from '@/components/roles/student/StudentProjectList'
import UpcomingMentorship from '@/components/dashboard/upcoming-mentorship'

// Country configurations
import { nigeriaConfig } from '@/config/countries/nigeria'
import { usConfig } from '@/config/countries/us'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LearningProgress {
  completedCourses: number
  totalCourses: number
  skills: {
    name: string
    progress: number
  }[]
  certifications: {
    name: string
    status: 'completed' | 'in_progress' | 'upcoming'
    date?: string
  }[]
}

interface MentorPreview {
  id: string;
  name: string;
  role: string;
  country: string;
  profileImage: string | null;
  bio: string | null;
  expertise: string[];
  experience: number | null;
  mentorshipAvailable: MentorAvailability;
  mentorshipPreferences: MentorshipPreferences | string;
}

interface MentorDiscoveryCardProps {
  mentor: MentorPreview;  // Changed from User to MentorPreview
  countryCode?: string;
  onRequestMentorship?: (mentorId: string) => void;
}

export default async function StudentDashboardPage({
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

    // Fetch comprehensive student data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            projects: true,
            mentorshipsAsMentee: true,
            messages: true,
          },
        },
        // Get active mentorships
        mentorshipsAsMentee: {
          where: { status: 'ACTIVE' },
          include: {
            mentor: true,
          },
          take: 3,
        },
        // Get recent projects
        projects: {
          orderBy: { updatedAt: 'desc' },
          take: 3,
          include: {
            team: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    })

    if (!userData) {
      redirect('/login')
    }

    // Get first name for personalization
    const firstName = session.user.name?.split(' ')[0] || 'Student'

    const availableMentors = await prisma.user.findMany({
      where: {
        OR: [
          { mentorshipAvailable: 'AVAILABLE' },
          { mentorshipAvailable: 'LIMITED' }
        ],
        role: { in: ['PROFESSIONAL', 'VETERAN'] },
        country: userCountry as any,
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        role: true,
        country: true,
        bio: true,
        expertise: true,
        experience: true,
        mentorshipAvailable: true,
        mentorshipPreferences: true,
      },
      take: 3,
    }).then(users => users.map(user => ({
      ...user,
      mentorshipAvailable: user.mentorshipAvailable || 'UNAVAILABLE'
    }))) as MentorPreview[];

    // Calculate dashboard stats
    const stats = {
      _count: {
        projects: userData._count?.projects || 0,
        mentorships: userData._count?.mentorshipsAsMentee || 0,
        messages: userData._count?.messages || 0,
      }
    }

    // Mock learning progress data (replace with real data when available)
    const learningProgress: LearningProgress = {
      completedCourses: 8,
      totalCourses: 12,
      skills: [
        { name: 'Architectural Design', progress: 75 },
        { name: 'CAD Software', progress: 60 },
        { name: 'Building Regulations', progress: 85 },
        { name: 'Sustainable Design', progress: 45 },
      ],
      certifications: [
        { 
          name: 'Basic Architectural Design',
          status: 'completed',
          date: '2024-01-15'
        },
        {
          name: 'Advanced CAD Modeling',
          status: 'in_progress'
        },
        {
          name: `${countryConfig.name} Building Standards`,
          status: 'upcoming'
        }
      ]
    }

    // Fetch upcoming deadlines
    const upcomingDeadlines = await prisma.task.findMany({
      where: {
        assignedToId: session.user.id,
        completed: false,
        dueDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: 5,
      include: {
        project: true,
      },
    })

    return (
        <div className="space-y-8">
            {/* Welcome Section with Country-Specific Content */}
            {userData._count.projects === 0 && (
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-48 object-cover"
                >
                  <source src={countryConfig.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50" />
                
                <div className="relative z-10 p-8">
                <h2 className="text-4xl font-extrabold mb-4 text-white drop-shadow-lg text-center">
                  Welcome to NexusForge {countryConfig.name}, {firstName}!
                </h2>
                  <p className="mb-4 text-sm text-white/90 drop-shadow-md text-center">
                    Begin your architectural journey in {countryConfig.name} with personalized learning paths, 
                    mentorship opportunities, and hands-on projects.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {countryConfig.onboarding?.map((step, index) => (
                      <div 
                        key={step.title}
                        className="bg-white/10 backdrop-blur-sm p-6 rounded-lg"
                      >
                        <div className="flex items-center mb-3">
                          <step.icon className="h-6 w-6 text-white mr-2" />
                          <h3 className="font-semibold text-white">
                            {index + 1}. {step.title}
                          </h3>
                        </div>
                        <p className="text-sm text-white/80">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Column 1: Core Stats and Activities */}
          <div className="space-y-6">
            <DashboardStats stats={stats} />
            
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Overall Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Course Completion</span>
                      <span>{Math.round((learningProgress.completedCourses / learningProgress.totalCourses) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${(learningProgress.completedCourses / learningProgress.totalCourses) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    {learningProgress.skills.map(skill => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill.name}</span>
                          <span>{skill.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Feed */}
            <RecentActivity userId={session.user.id} />
          </div>

          {/* Column 2: Projects and Deadlines */}
          <div className="space-y-6">
            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Active Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudentProjectList projects={userData.projects} />
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map(task => (
                    <div 
                      key={task.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-500">{task.project.title}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certifications Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningProgress.certifications.map(cert => (
                    <div 
                      key={cert.name}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{cert.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            cert.status === 'completed' ? 'bg-green-100 text-green-800' :
                            cert.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cert.status.replace('_', ' ').charAt(0).toUpperCase() + cert.status.slice(1)}
                          </span>
                          {cert.date && (
                            <span className="text-xs text-gray-500 ml-2">
                              Completed: {new Date(cert.date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: Mentorship and Country-Specific Resources */}
          <div className="space-y-6">
            {/* Mentorship Section */}
            <UpcomingMentorship 
              userId={session.user.id}
              userRole={session.user.role}
            />

            {/* Country-Specific Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  {countryConfig.name} Architecture Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {countryConfig.resources.map(resource => (
                    <div 
                      key={resource.title}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Discover Mentors */}
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Find Local Mentors
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableMentors.length > 0 ? (
                <div className="space-y-4">
                  {availableMentors.map((mentor) => (
                    <MentorDiscoveryCard
                      key={mentor.id}
                      mentor={mentor}
                      countryCode={userCountry}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No mentors currently available in your area.
                </p>
              )}
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