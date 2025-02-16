// src/types/index.ts

export type Country = 'NG' | 'US' | 'GB' | 'CA' // Add more as needed
export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'PROFESSIONAL' | 'STUDENT' | 'VETERAN' | 'CLIENT'
export type ProjectStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type MentorshipStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type RiskStatus = 'ACTIVE' | 'MITIGATED' | 'RESOLVED'
export type DocumentType = 'PDF' | 'DOC' | 'XLSX' | 'IMAGE' | 'OTHER'

export interface User {
  id: string
  name: string
  email: string
  password: string
  image?: string | null; 
  role: UserRole
  country: Country
  profileImage: string | null
  bio: string | null
  expertise: string[]
  experience: number | null
  createdAt: Date
  updatedAt: Date
  
  // Relations
  projects?: Project[]
  messages?: Message[]
  mentorshipsAsMentor?: Mentorship[]
  mentorshipsAsMentee?: Mentorship[]
  activities?: Activity[]
  teamMemberships?: TeamMember[]
  assignedTasks?: Task[]
  createdRisks?: Risk[]
  assignedRisks?: Risk[]
  riskAlerts?: RiskAlert[]
  riskHistoryUpdates?: RiskHistory[]
}

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  budget: number | null
  timeline: Date | null
  createdAt: Date
  updatedAt: Date
  userId: string
  
  // Relations
  user: User
  documents: Document[]
  team: TeamMember[]
  tasks: Task[]
  risks: Risk[]
  riskAlerts: RiskAlert[]
}

export interface Risk {
  id: string
  title: string
  description: string
  status: RiskStatus
  severity: number
  probability: number
  mitigation: string | null
  category: string | null
  projectId: string
  createdById: string
  assignedToId: string | null
  createdAt: Date
  updatedAt: Date
  
  // Relations
  project: Project
  createdBy: User
  assignedTo: User | null
  alerts: RiskAlert[]
  history: RiskHistory[]
}

export interface RiskAlert {
  id: string
  message: string
  read: boolean
  riskId: string
  projectId: string
  userId: string
  createdAt: Date
  
  // Relations
  risk: Risk
  project: Project
  user: User
}

export interface RiskHistory {
  id: string
  riskId: string
  updatedById: string
  previousStatus: string | null
  newStatus: string
  comment: string | null
  createdAt: Date
  
  // Relations
  risk: Risk
  updatedBy: User
}

export interface Mentorship {
  id: string
  status: MentorshipStatus
  nextSession: Date | null
  createdAt: Date
  updatedAt: Date
  mentorId: string
  menteeId: string
  
  // Relations
  mentor: User
  mentee: User
}

export interface Document {
  id: string
  title: string
  fileUrl: string
  size: number
  type: DocumentType
  createdAt: Date
  projectId: string
  
  // Relations
  project: Project
}

export interface TeamMember {
  id: string
  role: UserRole
  createdAt: Date
  userId: string
  projectId: string
  
  // Relations
  user: User
  project: Project
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate: Date
  completed: boolean
  createdAt: Date
  projectId: string
  assignedToId: string
  
  // Relations
  project: Project
  assignedTo: User
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  userId: string
  
  // Relations
  user: User
}

export interface Activity {
  id: string
  description: string
  type: string
  createdAt: Date
  userId: string
  
  // Relations
  user: User
}

export interface DashboardStats {
  _count: {
    projects: number
    mentorships: number
    messages: number
  }
}