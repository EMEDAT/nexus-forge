// src/lib/auth.ts
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { UserRole, Country } from "@/types"
import { Adapter } from "next-auth/adapters"

declare module "next-auth" {
  interface User {
    role: UserRole
    country: Country  
    gender: string 
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
      country: Country  
      gender: string 
    }
  }
}

export const authOptions: NextAuthOptions = {
  // Cast the adapter to satisfy TypeScript
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('AUTHORIZE CALLED WITH:', credentials?.email)
        
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing email or password')
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              country: true,
              gender: true, 
            }
          })

          console.log('USER FOUND:', user ? 'Yes' : 'No')

          if (!user) {
            console.error('No user found with this email')
            return null
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          console.log('PASSWORD MATCH:', isValidPassword)

          if (!isValidPassword) {
            console.error('Incorrect password')
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            country: user.country as Country,
            gender: user.gender,
          }
        } catch (error) {
          console.error("FULL AUTHORIZE ERROR:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "signIn" && user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.country = user.country
        token.gender = user.gender  // Add this line
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as UserRole
        session.user.country = token.country as Country
        session.user.gender = token.gender as string  // Add this line
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
}