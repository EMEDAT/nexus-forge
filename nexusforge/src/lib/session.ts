// src/lib/session.ts

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { getSession } from "next-auth/react"

// Server-side session retrieval
export async function getServerUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

// Client-side session retrieval
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}