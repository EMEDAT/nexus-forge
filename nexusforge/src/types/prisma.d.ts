// src\types\prisma.d.ts

import { 
  Prisma, 
  Risk as PrismaRisk, 
  RiskAlert as PrismaRiskAlert, 
  RiskHistory as PrismaRiskHistory,
  Mentorship as PrismaMentorship,
  MentorshipRequest as PrismaMentorshipRequest,
  User as PrismaUser
} from '@prisma/client'

// Extend Error interface for Prisma errors
declare module '@prisma/client' {
  interface PrismaClientKnownRequestError extends Error {
    code: string
    meta?: Record<string, unknown>
  }

  // Augment existing interfaces to include additional properties
  interface User {
    mentorshipAvailable?: string
    mentorshipPreferences?: Prisma.JsonValue
    state?: string
  }

  // Extend select types to include additional fields
  interface Prisma {
    UserSelect: {
      mentorshipAvailable?: boolean
      mentorshipPreferences?: boolean
      state?: boolean
    }

    MentorshipSelect: {
      startDate?: boolean
    }
  }
}

// Optional: Add more specific type extensions here
export {}