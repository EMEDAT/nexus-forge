// src\types\prisma.d.ts

import { 
  Prisma, 
  Risk as PrismaRisk, 
  RiskAlert as PrismaRiskAlert, 
  RiskHistory as PrismaRiskHistory 
} from '@prisma/client'

// Add this type declaration
declare module '@prisma/client' {
  interface PrismaClientKnownRequestError extends Error {
    code: string
    meta?: Record<string, unknown>
  }
}

declare global {
  // Extend PrismaClient with additional methods if needed
  interface PrismaClient {
    risk: Prisma.RiskDelegate<GlobalRejectSettings>
    riskAlert: Prisma.RiskAlertDelegate<GlobalRejectSettings>
    riskHistory: Prisma.RiskHistoryDelegate<GlobalRejectSettings>
  }
}