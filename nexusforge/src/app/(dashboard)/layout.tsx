// src/app/(dashboard)/layout.tsx
'use client'

import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { SessionProvider } from "next-auth/react"
import { CountryProvider } from "@/components/country-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <CountryProvider>
        <div className="h-screen flex dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4">
              {children}
            </main>
          </div>
        </div>
      </CountryProvider>
    </SessionProvider>
  )
}