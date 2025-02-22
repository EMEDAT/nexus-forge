// src\components\dashboard\header.tsx
'use client'

import { usePathname } from 'next/navigation'
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/dashboard/user-nav"
import { useRole } from '@/components/role-context'

export function Header() {
  const pathname = usePathname();
  const { userRole } = useRole();

  // Function to get page title based on pathname
  const getPageTitle = () => {
    const pathParts = pathname.split('/').filter(Boolean);
    
    // Remove role prefix if exists
    const cleanPath = pathParts.length > 1 && 
      ['student', 'professional', 'veteran', 'client'].includes(pathParts[0])
      ? pathParts.slice(1)
      : pathParts;

    // Map path to readable title
    const titleMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'projects': 'My Projects',
      'mentorship': 'Mentorship',
      'messages': 'Messages',
      'settings': 'Account Settings',
      'profile': 'Profile',
      'clients': 'Client Management',
      // Add more mappings as needed
    };

    const titleKey = cleanPath[cleanPath.length - 1];
    return titleMap[titleKey] || 
      titleKey.charAt(0).toUpperCase() + titleKey.slice(1);
  }

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-medium">
          {getPageTitle()}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  )
}