// src\types\prisma.d.ts

import { 
    Prisma, 
    Risk as PrismaRisk, 
    RiskAlert as PrismaRiskAlert, 
    RiskHistory as PrismaRiskHistory 
  } from '@prisma/client'
  
  declare module '@prisma/client' {
    interface PrismaClient {
      risk: Prisma.RiskDelegate<GlobalRejectSettings>
      riskAlert: Prisma.RiskAlertDelegate<GlobalRejectSettings>
      riskHistory: Prisma.RiskHistoryDelegate<GlobalRejectSettings>
    }
  }