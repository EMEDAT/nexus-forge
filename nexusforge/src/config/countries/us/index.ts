// src\config\countries\us\index.ts

import { CountryConfig } from '../types';
import { usArchitecturalStyles } from './styles';
import { usBuildingCodes } from './regulations';
import { usMaterials } from './materials';
import { usResources } from './resources';

export const usConfig: CountryConfig = {
  code: 'US',
  name: 'United States',
  flag: '/images/us-flag.svg',
  video: '/videos/us-flag.mp4', // You'll provide this later
  currency: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
  },
  measurementSystem: 'imperial',
  theme: {
    primary: '#B22234', // Red from US flag
    secondary: '#ffffff', // White
    accent: '#3C3B6E',   // Blue from US flag
    background: {
      light: '#f5f5f5',
      dark: '#121212'
    }
  },
  architecturalStyles: usArchitecturalStyles,
  buildingCodes: usBuildingCodes,
  commonMaterials: usMaterials,
  marketInsights: {
    budgetRange: '$50K - $500K',
    inDemandSkills: [
      'Sustainable Design',
      'BIM Technology',
      'Green Building Certification',
      'Smart Home Integration'
    ],
    hotRegions: [
      'San Francisco Bay Area',
      'New York City',
      'Austin',
      'Seattle'
    ],
    growthAreas: [
      'Sustainable Architecture',
      'Urban Redevelopment',
      'Mixed-Use Developments',
      'Adaptive Reuse Projects'
    ],
    averageSalary: '$82,320',
    jobMarketOutlook: 'Growing, with emphasis on sustainable design'
  },
  resources: usResources,
  regionalHubs: [
    {
      name: 'San Francisco Bay Area',
      description: 'Global center for innovative architectural design and technology',
      knownFor: [
        'Tech-inspired architecture',
        'Sustainable design',
        'Innovative urban planning'
      ],
      majorFirms: [
        'Gensler',
        'SOM (Skidmore, Owings & Merrill)',
        'AECOM'
      ],
      educationalInstitutions: [
        'UC Berkeley College of Environmental Design',
        'Stanford Architecture Program'
      ]
    },
    {
      name: 'New York City',
      description: 'Iconic architectural landscape with diverse styles',
      knownFor: [
        'Skyscraper design',
        'Historic preservation',
        'Urban architectural innovation'
      ],
      majorFirms: [
        'SHoP Architects',
        'Diller Scofidio + Renfro',
        'Michael Graves Architecture'
      ],
      educationalInstitutions: [
        'Columbia GSAPP',
        'Pratt Institute School of Architecture'
      ]
    }
  ]
};