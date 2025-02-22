// src/types/clientDashboard.ts
import { User, Project, Task, TeamMember } from '@/types'

export interface ClientMetrics {
  projects: {
    active: number
    completed: number
    underReview: number
    totalBudget: number
    currentSpend: number
  }
  architects: {
    engaged: number
    shortlisted: number
    reviewed: number
  }
  timelines: {
    onTrack: number
    delayed: number
    completed: number
  }
}

export interface DashboardProjectUser {
  id: string
  name: string | null
  profileImage: string | null
  expertise: string[]
  experience: number | null
}

export interface DashboardTeamMember extends TeamMember {
  user: User
}

export interface DashboardProject extends Omit<Project, 'user' | 'team' | 'status'> {
  user: DashboardProjectUser
  tasks: Task[]
  team: DashboardTeamMember[]
  actualCost?: number
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEW'
}

export interface DashboardUser extends Omit<User, 'projects'> {
  _count: {
    projects: number
    messages: number
  }
  projects: DashboardProject[]
}

export interface RecommendedArchitect {
  id: string
  name: string
  profileImage: string | null
  expertise: string[]
  experience: number | null
  _count: {
    projects: number
    mentorshipsAsMentor: number
  }
}

export interface MarketInsight {
  title: string
  description: string
  trend?: string
}