// src/config/countries.ts

import React from 'react';

export type CountryConfig = {
    code: string;
    name: string;
    flag: string;
    flagAnimation?: string;
    video?: string;
    currency: {
      code: string;
      symbol: string;
      name: string;
    };
    measurementSystem: 'metric' | 'imperial';
    languages: string[];
    architecturalStyles: Array<{
      name: string;
      description: string;
      period?: string;
      keyFeatures: string[];
      examples?: string[];
    }>;
    buildingCodes: Array<{
      name: string;
      description: string;
      url?: string;
    }>;
    commonMaterials: Array<{
      name: string;
      description: string;
      averageCost: number;
      unit: string;
      availability: 'high' | 'medium' | 'low';
    }>;
    regions: Array<{
      name: string;
      states?: string[];
    }>;
    marketInsights?: {
      budgetRange: string;
      inDemandSkills: string[];
      hotRegions: string[];
      growthAreas: string[];
    };
    resources?: Array<{
      id: string;
      type: 'guide' | 'template' | 'webinar' | 'course' | 'tool';
      title: string;
      description: string;
      url?: string;
      isFree: boolean;
      language: string[];
    }>;
    regionalHubs?: Array<{
      name: string;
      description: string;
      knownFor: string[];
      majorFirms?: string[];
      educationalInstitutions?: string[];
    }>;
    theme: {
      primary: string;
      secondary: string;
      accent: string;
      background: {
        light: string;
        dark: string;
      };
    };

    // Optional dashboard-specific properties
    onboarding?: Array<{
      title: string;
      description: string;
      icon: React.ComponentType<{ className?: string }>;
    }>;
    
    publications?: Array<{
      title: string;
      journal: string;
      date: string;
    }>;
    
    researchProjects?: Array<{
      title: string;
      description: string;
      status: string;
    }>;
    
    workshops?: Array<{
      title: string;
      topic: string;
      date: string;
      participants: number;
    }>;
    
    industryTrends?: Array<{
      title: string;
      description: string;
      impact: string;
      trend?: string;
    }>;
    
    committees?: Array<{
      name: string;
      role: string;
      responsibilities: string;
    }>;
    
    speakingEngagements?: Array<{
      title: string;
      venue: string;
      date: string;
      audience: number;
    }>;
    
    legacyProjects?: Array<{
      title: string;
      description: string;
      status: string;
      impact: string;
      recognition?: string;
    }>;
    
    contributions?: Array<{
      title: string;
      description: string;
      tags: string[];
    }>;
    
    regulations?: Array<{
      title: string;
      description: string;
      status: string;
    }>;
    
    buildingStandards?: Array<{
      name: string;
      description: string;
    }>;
    
    suppliers?: Array<{
      name: string;
      materials: string[];
      rating: number;
    }>;
    
    certifications?: Array<{
      name: string;
      authority: string;
      status: string;
      expiryDate: string;
    }>;
    
    training?: Array<{
      title: string;
      provider: string;
      date: string;
    }>;
    
    buildingGuidelines?: Array<{
      title: string;
      description: string;
    }>;
    
    permits?: Array<{
      name: string;
      requirements: string;
      timeline: string;
    }>;
}

// Helper functions remain the same
export function getCountryConfig(countryCode: string): CountryConfig | null {
  const countryConfigs: Record<string, CountryConfig> = {
    NG: {
      ...nigeriaConfig,
      
      // Add specific dashboard-specific configurations for Nigeria
      onboarding: [
        {
          title: 'Explore Architecture',
          description: 'Discover the rich architectural heritage of Nigeria',
          icon: () => null // Replace with actual icon component
        },
        // Add more onboarding steps
      ],
      publications: [
        {
          title: 'Nigerian Architectural Trends',
          journal: 'Arch Nigeria',
          date: '2024-01-15'
        }
      ],
      // Add other optional properties as needed
    }
  };
  return countryConfigs[countryCode] || null;
}

export function getAllCountries(): Array<{code: string, name: string, flag: string}> {
  const countryConfigs: Record<string, CountryConfig> = {
    NG: nigeriaConfig,
    // Add more countries as needed
  };
  return Object.entries(countryConfigs).map(([code, config]) => ({
    code,
    name: config.name,
    flag: config.flag
  }));
}

// Reconstruct the original Nigerian configuration with optional properties
const nigeriaConfig: CountryConfig = {
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
  architecturalStyles: [
    // ... existing styles
  ],
  buildingCodes: [
    // ... existing building codes
  ],
  commonMaterials: [
    // ... existing materials
  ],
  regions: [
    // ... existing regions
  ],
  marketInsights: {
    budgetRange: '₦25M - ₦150M',
    inDemandSkills: ['BIM', 'Sustainable Design', 'Cultural Preservation'],
    hotRegions: ['Lagos', 'Abuja', 'Port Harcourt'],
    growthAreas: ['Urban Housing', 'Commercial Centers', 'Cultural Institutions']
  },
  resources: [
    // ... existing resources
  ],
  regionalHubs: [
    // ... existing regional hubs
  ],
  theme: {
    primary: '#008751', // Green from Nigerian flag
    secondary: '#ffffff', // White
    accent: '#0a3d62',   // Deep blue
    background: {
      light: '#f5f5f5',
      dark: '#121212'
    }
  },

  // Optional dashboard-specific properties
  onboarding: [
    {
      title: 'Start Your Journey',
      description: 'Begin exploring architectural opportunities in Nigeria',
      icon: () => null // Replace with actual icon component
    }
  ],
  publications: [
    {
      title: 'Nigerian Architecture: Past and Future',
      journal: 'African Architectural Review',
      date: '2024-02-01'
    }
  ],
  researchProjects: [
    {
      title: 'Sustainable Urban Design in Lagos',
      description: 'Exploring eco-friendly architectural solutions',
      status: 'active'
    }
  ],
  workshops: [
    {
      title: 'Modern Nigerian Architecture Symposium',
      topic: 'Cultural Integration in Design',
      date: '2024-03-15',
      participants: 150
    }
  ],
  industryTrends: [
    {
      title: 'Green Building Technologies',
      description: 'Emerging sustainable design practices',
      impact: 'High potential for transformation',
      trend: 'Growing adoption'
    }
  ]
};