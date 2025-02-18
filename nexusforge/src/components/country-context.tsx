// src\components\country-context.tsx

'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CountryConfig, getCountryConfig } from '@/config/countries'

// Create a default config that matches your expanded CountryConfig type
const defaultConfig: CountryConfig = {
  code: 'NG',
  name: 'Nigeria',
  flag: '/images/nigeria-flag.svg',
  flagAnimation: '/images/nigeria-flag-animated.svg',
  video: '/videos/nigerian-flag.mp4',
  currency: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
  },
  measurementSystem: 'metric',
  languages: ['English', 'Yoruba', 'Hausa', 'Igbo'],
  architecturalStyles: [],
  buildingCodes: [],
  commonMaterials: [],
  regions: [],
  marketInsights: {
    budgetRange: '₦25M - ₦150M',
    inDemandSkills: ['BIM', 'Sustainable Design'],
    hotRegions: ['Lagos', 'Abuja', 'Port Harcourt'],
    growthAreas: [],
  },
  resources: [],
  regionalHubs: [],
  theme: {
    primary: '#008751',
    secondary: '#ffffff',
    accent: '#0a3d62',
    background: {
      light: '#f5f5f5',
      dark: '#121212'
    }
  }
};

// Define the context type
type CountryContextType = {
  countryCode: string;
  countryConfig: CountryConfig;
}

// Create the context with default values
const CountryContext = createContext<CountryContextType>({
  countryCode: 'NG',
  countryConfig: defaultConfig,
});

// Create the provider component
export function CountryProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [countryCode, setCountryCode] = useState<string>('NG');
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(defaultConfig);
  
  useEffect(() => {
    // Set country code from session if available
    if (session?.user?.country) {
      setCountryCode(session.user.country as string);
    }
    
    // Get the country configuration
    const config = getCountryConfig(countryCode);
    if (config) {
      setCountryConfig(config);
      
      // Apply country-specific CSS variables
      document.documentElement.style.setProperty('--country-primary', config.theme.primary);
      document.documentElement.style.setProperty('--country-secondary', config.theme.secondary);
      document.documentElement.style.setProperty('--country-accent', config.theme.accent);
      
      // Apply measurement system class
      if (config.measurementSystem === 'metric') {
        document.documentElement.classList.add('metric');
        document.documentElement.classList.remove('imperial');
      } else {
        document.documentElement.classList.add('imperial');
        document.documentElement.classList.remove('metric');
      }
      
      // Apply country-specific background colors based on theme
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      document.documentElement.style.setProperty(
        '--country-background',
        theme === 'dark' ? config.theme.background.dark : config.theme.background.light
      );
    }
    
  }, [countryCode, session]);

  return (
    <CountryContext.Provider value={{ countryCode, countryConfig }}>
      {children}
    </CountryContext.Provider>
  );
}

// Custom hook to use the country context
export function useCountry() {
  return useContext(CountryContext);
}