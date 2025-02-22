// src/components/providers.tsx
'use client'

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { MentorshipProvider } from './mentorship-context';
import { RoleProvider } from './role-context';
import { CountryProvider } from './country-context'; 
import { ExperienceProvider } from './experience-context';
import { useEffect, useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Ensure light theme is set by default
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme')
      if (!storedTheme) {
        localStorage.setItem('theme', 'light')
      }
    }
  }, [])

  if (!mounted) {
    return <div className="light">{children}</div>
  }

  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light"
        forcedTheme={mounted ? undefined : "light"}
        themes={['light', 'dark']}
        enableSystem={false}
        disableTransitionOnChange
      >
        <RoleProvider>
          <CountryProvider>
            <ExperienceProvider>
              <MentorshipProvider>
                {children}
              </MentorshipProvider>
            </ExperienceProvider>
          </CountryProvider>
        </RoleProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}