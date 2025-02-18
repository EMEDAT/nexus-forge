// src/config/countries/nigeria/index.ts
import { CountryConfig } from '../types';
import { nigerianArchitecturalStyles } from './styles';
import { nigerianBuildingCodes } from './regulations';
import { nigerianMaterials } from './materials';
import { nigerianResources } from './resources';

export const nigeriaConfig: CountryConfig = {
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
  theme: {
    primary: '#008751', // Green from Nigerian flag
    secondary: '#ffffff', // White
    accent: '#0a3d62', // Deep blue
    background: {
      light: '#f5f5f5',
      dark: '#121212'
    }
  },
  architecturalStyles: nigerianArchitecturalStyles,
  buildingCodes: nigerianBuildingCodes,
  commonMaterials: nigerianMaterials,
  marketInsights: {
    budgetRange: '₦25M - ₦150M',
    inDemandSkills: ['BIM', 'Sustainable Design', 'Cultural Preservation'],
    hotRegions: ['Lagos', 'Abuja', 'Port Harcourt'],
    growthAreas: ['Urban Housing', 'Commercial Centers', 'Cultural Institutions'],
    averageSalary: '₦6M - ₦15M annually',
    jobMarketOutlook: 'Growing demand for eco-friendly and culturally relevant designs'
  },
  resources: nigerianResources,
  regionalHubs: [
    {
      name: 'Lagos',
      description: 'The commercial capital with the most architectural firms and modern projects',
      knownFor: ['High-rises', 'Mixed-use developments', 'Contemporary designs'],
      majorFirms: ['Chronos Studeos', 'HTL Africa', 'James Cubitt Architects'],
      educationalInstitutions: ['University of Lagos', 'Covenant University']
    },
    {
      name: 'Abuja',
      description: 'The planned capital city with significant government and institutional projects',
      knownFor: ['Government buildings', 'Planned layouts', 'Cultural institutions'],
      majorFirms: ['Design Group Nigeria', 'AD Consulting'],
      educationalInstitutions: ['University of Abuja']
    }
  ]
};