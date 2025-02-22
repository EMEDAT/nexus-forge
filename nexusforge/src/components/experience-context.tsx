// src/components/experience-context.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { useRole, RoleConfig } from './role-context';
import { useCountry } from './country-context';
import { CountryConfig } from '@/config/countries';

// Define the combined experience context type
type ExperienceContextType = {
  userRole: string | null;
  countryCode: string;
  roleConfig: RoleConfig;
  countryConfig: CountryConfig;
  isFeatureAllowed: (feature: string) => boolean;
  isActionAllowed: (action: string) => boolean;
  getDashboardPath: () => string;
  getCountrySpecificResource: (resourceType: string) => any[];
  getTheme: () => {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      light: string;
      dark: string;
    };
  };
};

// Create the context
const ExperienceContext = createContext<ExperienceContextType | null>(null);

// Create the provider component
export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const { 
    userRole,
    roleConfig,
    isRoleFeatureAllowed,
    isRoleActionAllowed,
    getRoleDashboardPath
  } = useRole();
  
  const { countryCode, countryConfig } = useCountry();

  // Check if a feature is allowed based on both role and country
  const isFeatureAllowed = (feature: string): boolean => {
    // First check if the role allows it
    if (!isRoleFeatureAllowed(feature)) {
      return false;
    }

    // Then check country-specific restrictions
    // For example, some features might be available only in certain countries
    const countryRestrictedFeatures: Record<string, string[]> = {
      'NG': ['local-materials', 'nigerian-regulations'],
      'US': ['us-building-codes', 'imperial-measurements']
    };

    const restrictedFeatures = countryRestrictedFeatures[countryCode] || [];
    
    // If feature is country-restricted, only allow if user is in that country
    if (feature.startsWith('country-specific:')) {
      const specificFeature = feature.split(':')[1];
      return restrictedFeatures.includes(specificFeature);
    }

    // Otherwise allow it
    return true;
  };

  // Check if an action is allowed based on both role and country
  const isActionAllowed = (action: string): boolean => {
    return isRoleActionAllowed(action);
  };

  // Get the dashboard path with country consideration
  const getDashboardPath = (): string => {
    const baseDashboardPath = getRoleDashboardPath();
    // Could add country-specific query params if needed
    return `${baseDashboardPath}?country=${countryCode}`;
  };

  // Get country-specific resources based on type
  const getCountrySpecificResource = (resourceType: string): any[] => {
    switch (resourceType) {
      case 'architecturalStyles':
        return countryConfig.architecturalStyles || [];
      case 'buildingCodes':
        return countryConfig.buildingCodes || [];
      case 'materials':
        return countryConfig.commonMaterials || [];
      case 'resources':
        return countryConfig.resources || [];
      case 'regions':
        return countryConfig.regions || [];
      default:
        return [];
    }
  };

  // Get combined theme based on role and country
  const getTheme = () => {
    return {
      // Prioritize role primary color, fallback to country
      primary: roleConfig.theme.primary || countryConfig.theme.primary,
      secondary: countryConfig.theme.secondary,
      // Combine accent colors
      accent: roleConfig.theme.accent || countryConfig.theme.accent,
      background: countryConfig.theme.background
    };
  };

  const contextValue: ExperienceContextType = {
    userRole,
    countryCode,
    roleConfig,
    countryConfig,
    isFeatureAllowed,
    isActionAllowed,
    getDashboardPath,
    getCountrySpecificResource,
    getTheme
  };

  return (
    <ExperienceContext.Provider value={contextValue}>
      {children}
    </ExperienceContext.Provider>
  );
}

// Custom hook to use the experience context
export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}