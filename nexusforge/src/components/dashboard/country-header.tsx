// src\components\dashboard\country-header.tsx

'use client'

import { useCountry } from '../country-context'
import Image from 'next/image'
import { Gender } from '@/types'

// Define the expected user props based on session.user type
interface CountryHeaderUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  profileImage?: string | null;
  gender?: string | Gender | null; // Accept both string and Gender enum
  country?: string;
}

interface CountryHeaderProps {
  user: CountryHeaderUser;
}

export function CountryHeader({ user }: CountryHeaderProps) {
  const { countryConfig } = useCountry()
  
  // Helper function to determine if gender is female
  const isFemale = () => {
    if (!user.gender) return false;
    if (typeof user.gender === 'string') {
      return user.gender.toUpperCase() === 'FEMALE';
    }
    return user.gender === 'FEMALE';
  };
  
  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-md"
      style={{ 
        background: `linear-gradient(to right, ${countryConfig.theme.primary}80, ${countryConfig.theme.accent}80)`,
      }}
    >
      <div className="absolute right-0 top-0 opacity-20">
        <Image
          src={countryConfig.flag}
          alt={`${countryConfig.name} Flag`}
          width={150}
          height={100}
          className="object-cover"
        />
      </div>
      
      <div className="relative z-10 p-6">
        <div className="flex items-center">
          <div className="mr-4">
            <Image
              src={user.profileImage || user.image || `/images/default-${isFemale() ? 'female' : 'male'}-avatar.svg`}
              alt={user.name || 'User'}
              width={64}
              height={64}
              className="rounded-full border-2 border-white"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome, {user.name || 'User'}!
            </h2>
            <p className="text-white/80">
              Explore NexusForge {countryConfig.name} resources and connect with local architects
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}