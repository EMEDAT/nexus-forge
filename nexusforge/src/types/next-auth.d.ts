// src/types/next-auth.d.ts
import type { UserRole, Country } from '@/types'

declare module 'next-auth' {
  interface User {
    id: string
    role: UserRole
    country: Country
    profileImage?: string | null
    bio?: string | null
    expertise?: string[]
    experience?: number | null
  }

  interface Session {
    user: User & {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    country: Country
    profileImage?: string | null
    bio?: string | null
    expertise?: string[]
    experience?: number | null
  }
}