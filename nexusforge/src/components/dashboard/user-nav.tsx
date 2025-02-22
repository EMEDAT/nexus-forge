// src/components/dashboard/user-nav.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useCountry } from '../country-context'
import { useRole } from '../role-context'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'

export function UserNav() {
  const { data: session } = useSession()
  const { countryConfig } = useCountry()
  const { userRole, roleConfig } = useRole()
  const [avatarError, setAvatarError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  if (!session?.user) {
    return null
  }

  // Get the user's first name
  const firstName = session.user.name?.split(' ')[0] || 'User'
  
  // Determine gender for avatar - FIXED to handle string/enum properly
  const isFemale = typeof session.user.gender === 'string' 
    ? session.user.gender.toUpperCase() === 'FEMALE'
    : session.user.gender === 'FEMALE';
    
  // Use the correct path based on gender
  const defaultAvatar = `/images/default-${isFemale ? 'female' : 'male'}-avatar.svg`
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full overflow-hidden relative bg-gray-200 dark:bg-gray-700">
          {/* Using onLoadingComplete instead of onError for better handling */}
          <Image
            src={defaultAvatar}
            alt={firstName}
            width={32}
            height={32}
            className="object-cover h-full w-full"
            priority
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{firstName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{roleConfig?.name || userRole}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {session.user.email}
            </p>
          </div>
          
          <div className="py-1">
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => {
                setIsOpen(false)
                // Navigate to profile
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => {
                setIsOpen(false)
                // Navigate to settings
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}