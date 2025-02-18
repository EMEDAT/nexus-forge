// src/config/countries/types.ts

// Base type for country configuration
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
    theme: {
      primary: string;
      secondary: string;
      accent: string;
      background: {
        light: string;
        dark: string;
      };
    };
    architecturalStyles: ArchitecturalStyle[];
    buildingCodes: BuildingCode[];
    commonMaterials: Material[];
    marketInsights: MarketInsights;
    resources: Resource[];
    regionalHubs: RegionalHub[];
  };
  
  // Architectural style
  export type ArchitecturalStyle = {
    id: string;
    name: string;
    description: string;
    periodStart?: string;
    periodEnd?: string;
    keyFeatures: string[];
    imageUrl?: string;
    examples: Example[];
  };
  
  // Building codes and regulations
  export type BuildingCode = {
    id: string;
    name: string;
    description: string;
    url?: string;
    enforcementLevel: 'national' | 'state' | 'local';
    lastUpdated?: string;
  };
  
  // Construction materials
  export type Material = {
    id: string;
    name: string;
    description: string;
    localCost: {
      amount: number;
      unit: string;
    };
    availability: 'high' | 'medium' | 'low';
    sustainabilityRating: 1 | 2 | 3 | 4 | 5;
    commonUses: string[];
    suppliers?: Supplier[];
  };
  
  // Examples of specific buildings
  export type Example = {
    name: string;
    location: string;
    image?: string;
    year?: string;
    description?: string;
    architect?: string;
  };
  
  // Material suppliers
  export type Supplier = {
    name: string;
    location: string;
    contact?: string;
    website?: string;
  };
  
  // Market insights for the country
  export type MarketInsights = {
    budgetRange: string;
    inDemandSkills: string[];
    hotRegions: string[];
    growthAreas: string[];
    averageSalary?: string;
    jobMarketOutlook?: string;
  };
  
  // Educational resources
  export type Resource = {
    id: string;
    type: 'guide' | 'template' | 'webinar' | 'course' | 'tool';
    title: string;
    description: string;
    url?: string;
    isFree: boolean;
    language: string[];
  };
  
  // Major architectural hubs in the country
  export type RegionalHub = {
    name: string;
    description: string;
    knownFor: string[];
    majorFirms?: string[];
    educationalInstitutions?: string[];
  };