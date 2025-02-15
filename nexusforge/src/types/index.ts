// src/types/index.ts

export type ProjectStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'PROFESSIONAL' | 'STUDENT' | 'VETERAN' | 'CLIENT'
export type DocumentType = 'PDF' | 'DOC' | 'XLSX' | 'IMAGE' | 'OTHER'

export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  role: UserRole
}

export interface TeamMember {
  id: string
  role: UserRole
  userId: string
  user: User
}

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  timeline: Date
  budget?: number
  userId: string
  user: User
  documents: Document[]
  team: TeamMember[]
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  title: string
  fileUrl: string
  size: number
  type: DocumentType
  projectId: string
  createdAt: Date
}

export interface TeamMember {
  id: string
  role: UserRole
  userId: string
  user: User
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate: Date
  assignedToId: string
  projectId: string
  completed: boolean
  createdAt: Date
}

export interface DashboardStats {
  _count: {
    projects: number
    mentorships: number
    messages: number
  }
}

export interface Mentorship {
  id: string
  mentorId: string
  menteeId: string
  mentor: User
  mentee: User
  nextSession: Date
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

export interface Activity {
  id: string
  userId: string
  description: string
  type: string
  createdAt: Date
}