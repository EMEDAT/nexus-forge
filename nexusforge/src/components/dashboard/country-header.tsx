// src/components/dashboard/country-header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCountry } from '@/components/country-context';
import { useRole } from '@/components/role-context';
import { Gender } from '@/types';
import { ChevronDown, Map, Ruler, BookOpen, Palette } from 'lucide-react';

interface CountryHeaderUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  gender?: string | Gender | null;
  country?: string;
  role?: string;
}

interface CountryHeaderProps {
  user?: CountryHeaderUser;
  country?: string;
  userRole?: string;
}

export function CountryHeader({ user, country, userRole }: CountryHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { countryConfig, countryCode: contextCountryCode } = useCountry();
  const { userRole: contextUserRole, roleConfig } = useRole();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if we're on a country-specific page
  const isCountryPage = pathname?.includes('/country/');
  
  // If we're not on a country page and no user is provided, don't show anything
  if (!isCountryPage && !user) {
    return null;
  }
  
  // Use provided params or fallback to context/user values
  const effectiveCountry = country || user?.country || contextCountryCode;
  const effectiveRole = userRole || user?.role || contextUserRole;
  
  // Helper function to determine if gender is female
  const isFemale = () => {
    if (!user?.gender) return false;
    if (typeof user.gender === 'string') {
      return user.gender.toUpperCase() === 'FEMALE';
    }
    return user.gender === 'FEMALE';
  };

  // Get only the first name
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Get role description
  const getRoleDescription = () => {
    switch (effectiveRole?.toUpperCase()) {
      case 'STUDENT': return 'Architecture Student';
      case 'PROFESSIONAL': return 'Professional Architect';
      case 'VETERAN': return 'Veteran Architect';
      case 'CLIENT': return 'Architecture Client';
      default: return 'NexusForge User';
    }
  };
  
  // Generate quick links for country resources
  const countryLinks = [
    {
      name: 'Resources',
      href: `/country/${effectiveCountry?.toLowerCase()}/resources`,
      icon: BookOpen,
    },
    {
      name: 'Materials',
      href: `/country/${effectiveCountry?.toLowerCase()}/materials`,
      icon: Palette,
    },
    {
      name: 'Regulations',
      href: `/country/${effectiveCountry?.toLowerCase()}/regulations`,
      icon: Ruler,
    },
    {
      name: 'Styles',
      href: `/country/${effectiveCountry?.toLowerCase()}/styles`,
      icon: Map,
    },
  ];
  
  // Other available countries
  const otherCountries = [
    { code: 'NIGERIA', name: 'Nigeria', flag: '/images/nigeria-flag.svg' },
    { code: 'UNITED_STATES', name: 'United States', flag: '/images/us-flag.svg' }
  ].filter(c => c.code !== effectiveCountry);
  
  // Handle country change
  const handleCountryChange = (newCountry: string) => {
    // Redirect to current path but with new country
    const url = `${window.location.pathname}?country=${newCountry}`;
    router.push(url);
    setIsDropdownOpen(false);
  };
  
  // Determine avatar source with fallback
  const avatarSrc = user?.image;
  const defaultAvatarSrc = `/images/default-${isFemale() ? 'female' : 'male'}-avatar.svg`;
  
  // Combine role and country themes
  const headerBackground = roleConfig?.theme.primary || countryConfig?.theme.primary || '#4361ee';
  const headerAccent = roleConfig?.theme.accent || countryConfig?.theme.accent || '#3a0ca3';
  
  // Country selector bar - only show on country pages
  const countrySelector = isCountryPage && countryConfig && (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="relative">
          <button
            type="button"
            className="group flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
          >
            {countryConfig?.flag && (
              <Image
                src={countryConfig.flag}
                alt={countryConfig.name}
                width={20}
                height={15}
                className="rounded-sm mr-2"
                priority
              />
            )}
            <span className="font-medium text-sm">{countryConfig?.name}</span>
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {/* Dropdown for country selection */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-40">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {otherCountries.map(otherCountry => (
                  <button
                    key={otherCountry.code}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleCountryChange(otherCountry.code)}
                    role="menuitem"
                  >
                    <Image
                      src={otherCountry.flag}
                      alt={otherCountry.name}
                      width={20}
                      height={15}
                      className="rounded-sm mr-2"
                      priority
                    />
                    {otherCountry.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={isCountryPage ? "mb-8" : ""}>
      {countrySelector}
      
      {/* Only render the user header on country pages */}
      {isCountryPage && user && (
        <div 
          className="relative overflow-hidden rounded-lg shadow-md mt-4"
          style={{ 
            background: `linear-gradient(135deg, ${headerBackground}90, ${headerAccent}90)`,
          }}
        >
          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4 relative">
                  {!imageError && avatarSrc ? (
                    <div className="w-16 h-16 relative">
                      <Image
                        src={avatarSrc}
                        alt={firstName}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-white object-cover"
                        onError={() => setImageError(true)}
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 relative">
                      <Image
                        src={defaultAvatarSrc}
                        alt={firstName}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-white"
                        priority
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Welcome, {firstName}!
                  </h2>
                  <p className="text-white/80">
                    <span>{getRoleDescription()}</span>
                  </p>
                </div>
              </div>
              
              {/* Quick links */}
              <div className="flex flex-wrap gap-2">
                {countryLinks.map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-white/25 hover:bg-white/30 text-white transition-colors"
                  >
                    <link.icon className="h-3.5 w-3.5 mr-1" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Country message */}
            <div className="mt-4 text-white/90 text-sm">
              Explore resources tailored to your needs as a {effectiveRole?.toLowerCase() || 'user'}
            </div>
          </div>
        </div>
      )}
      
      {/* Simplified header for non-user contexts - show when no user provided but on country page */}
      {isCountryPage && !user && countryConfig && (
        <div 
          className="py-4 px-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm mt-4"
          style={{ 
            borderLeft: `4px solid ${headerBackground}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {countryConfig.name} Architecture Resources
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Exploring architectural content for {countryConfig.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}