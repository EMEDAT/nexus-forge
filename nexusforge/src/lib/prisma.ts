// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = 
  globalForPrisma.prisma ?? 
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: [
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  })

// Connection test with more detailed logging
export async function testPrismaConnection() {
  try {
    console.log('Testing Prisma connection...')
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:(.*?)@/, ':****@'))
    
    await prisma.$connect()
    
    // Attempt a simple query to verify connection
    const userCount = await prisma.user.count()
    
    console.log('Prisma connection successful')
    console.log('Current user count:', userCount)
    return true
  } catch (error) {
    console.error('Prisma connection failed:', error)
    
    // Log more details about the connection error
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
    }
    
    return false
  } finally {
    await prisma.$disconnect()
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}