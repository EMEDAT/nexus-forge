// src/components/role-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Define types for role configurations
export type RoleFeatures = {
  dashboard: string;
  primaryFeatures: string[];
  secondaryFeatures: string[];
  allowedActions: string[];
};

export type RoleConfig = {
  name: string;
  icon: string;
  description: string;
  features: RoleFeatures;
  theme: {
    primary: string;
    accent: string;
    icon: string;
  };
};

// Default configurations for each role
const roleConfigs: Record<string, RoleConfig> = {
  STUDENT: {
    name: 'Student',
    icon: '/icons/student.svg',
    description: 'Architecture student looking to learn and grow',
    features: {
      dashboard: '/student/dashboard',
      primaryFeatures: ['projects', 'mentorship', 'resources', 'portfolio'],
      secondaryFeatures: ['community', 'learning', 'challenges'],
      allowedActions: ['create-project', 'request-mentorship', 'submit-work']
    },
    theme: {
      primary: '#4361ee',
      accent: '#3a0ca3',
      icon: 'book'
    }
  },
  PROFESSIONAL: {
    name: 'Professional',
    icon: '/icons/professional.svg',
    description: 'Working architect or designer',
    features: {
      dashboard: '/professional/dashboard',
      primaryFeatures: ['clients', 'projects', 'mentorship', 'portfolio'],
      secondaryFeatures: ['billing', 'team', 'marketplace'],
      allowedActions: ['create-project', 'mentor-students', 'manage-clients', 'create-team']
    },
    theme: {
      primary: '#087f5b',
      accent: '#0b5e44',
      icon: 'building'
    }
  },
  VETERAN: {
    name: 'Veteran',
    icon: '/icons/veteran.svg',
    description: 'Experienced architect with decades of expertise',
    features: {
      dashboard: '/veteran/dashboard',
      primaryFeatures: ['mentorship', 'knowledge-base', 'consulting'],
      secondaryFeatures: ['community', 'legacy-projects', 'speaking'],
      allowedActions: ['mentor-professionals', 'create-resources', 'review-work']
    },
    theme: {
      primary: '#6c757d',
      accent: '#495057',
      icon: 'award'
    }
  },
  CLIENT: {
    name: 'Client',
    icon: '/icons/client.svg',
    description: 'Looking to hire architectural services',
    features: {
      dashboard: '/client/dashboard',
      primaryFeatures: ['projects', 'architects', 'resources'],
      secondaryFeatures: ['payments', 'reviews', 'recommendations'],
      allowedActions: ['create-project', 'hire-architect', 'review-work']
    },
    theme: {
      primary: '#e63946',
      accent: '#d00000',
      icon: 'briefcase'
    }
  }
};

// Default role config
const defaultRoleConfig: RoleConfig = roleConfigs.STUDENT;

// Define the context type
type RoleContextType = {
  userRole: string | null;
  roleConfig: RoleConfig;
  isRoleFeatureAllowed: (feature: string) => boolean;
  isRoleActionAllowed: (action: string) => boolean;
  getRoleDashboardPath: () => string;
};

// Create the context with default values
const RoleContext = createContext<RoleContextType>({
  userRole: null,
  roleConfig: defaultRoleConfig,
  isRoleFeatureAllowed: () => false,
  isRoleActionAllowed: () => false,
  getRoleDashboardPath: () => '/dashboard',
});

// Create the provider component
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleConfig, setRoleConfig] = useState<RoleConfig>(defaultRoleConfig);
  
  useEffect(() => {
    // Set role from session if available
    if (session?.user?.role) {
      const role = session.user.role as string;
      setUserRole(role);
      
      // Get the role configuration
      const config = roleConfigs[role];
      if (config) {
        setRoleConfig(config);
        
        // Apply role-specific CSS variables
        document.documentElement.style.setProperty('--role-primary', config.theme.primary);
        document.documentElement.style.setProperty('--role-accent', config.theme.accent);
      }
    }
  }, [session]);

  // Check if a feature is allowed for the current role
  const isRoleFeatureAllowed = (feature: string): boolean => {
    if (!userRole) return false;
    
    const allFeatures = [
      ...roleConfig.features.primaryFeatures,
      ...roleConfig.features.secondaryFeatures
    ];
    
    return allFeatures.includes(feature);
  };

  // Check if an action is allowed for the current role
  const isRoleActionAllowed = (action: string): boolean => {
    if (!userRole) return false;
    return roleConfig.features.allowedActions.includes(action);
  };

  // Get the dashboard path for the current role
  const getRoleDashboardPath = (): string => {
    if (!userRole) return '/dashboard';
    return roleConfig.features.dashboard;
  };

  return (
    <RoleContext.Provider value={{
      userRole,
      roleConfig,
      isRoleFeatureAllowed,
      isRoleActionAllowed,
      getRoleDashboardPath
    }}>
      {children}
    </RoleContext.Provider>
  );
}

// Custom hook to use the role context
export function useRole() {
  return useContext(RoleContext);
}