// src/types/professionalDashboard.ts
import { User, Project, Task, Mentorship, TeamMember, Risk as BaseRisk } from '@/types'

export interface BusinessMetrics {
  revenue: {
    current: number
    previous: number
    projected: number
    currency: string
    trend: number
  }
  projects: {
    active: number
    pipeline: number
    completed: number
    overdue: number
  }
  compliance: {
    permits: number
    pendingApprovals: number
    expiringLicenses: number
  }
}

export interface DashboardProject extends Omit<Project, 'team'> {
  tasks: Task[]
  team: (TeamMember & { user: User })[]
  risks: BaseRisk[]
}

export interface DashboardUser extends Omit<User, 'projects'> {
  _count?: {
    projects: number
    mentorshipsAsMentor: number
    messages: number
  }
  projects?: DashboardProject[]
  mentorshipsAsMentor?: (Mentorship & {
    mentee: User
  })[]
}

export interface MeetingTask extends Task {
  project: Project
}