// src\components\dashboard\header.tsx

'use client'

import dynamic from 'next/dynamic'
import { ModeToggle } from "../mode-toggle"

// Dynamically import UserNav to resolve module import issue
const UserNav = dynamic(() => import('./user-nav').then(mod => mod.UserNav), {
  ssr: false
})

export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-medium">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}