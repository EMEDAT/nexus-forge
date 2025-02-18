// src/config/countries.ts

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
  }
  
  // Nigerian configuration
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
      {
        name: 'Traditional Yoruba',
        description: 'Features courtyard layouts, impluvium roofing, and carved wooden elements',
        keyFeatures: [
          'Courtyard designs',
          'Impluvium roofing',
          'Carved wooden posts',
          'Mud brick construction',
          'Community-centered layouts'
        ],
        examples: ['Afin Oyo (Oyo Palace)', 'Osun-Osogbo Sacred Grove']
      },
      {
        name: 'Colonial Architecture',
        description: 'British-influenced buildings with adaptations for tropical climate',
        period: '1900-1960',
        keyFeatures: [
          'Symmetrical facades',
          'Columned entrances',
          'High ceilings',
          'Large windows',
          'Verandas'
        ],
        examples: ['Carter Bridge House', 'First Bank Building Lagos']
      },
      {
        name: 'Contemporary Nigerian',
        description: 'Modern designs that incorporate traditional elements with climate-responsive features',
        period: '1960-present',
        keyFeatures: [
          'Climate-responsive design',
          'Integration of local materials',
          'Cultural motifs',
          'Sustainability features',
          'Indoor-outdoor living spaces'
        ],
        examples: ['NECOM House', 'Nestoil Tower']
      }
    ],
    buildingCodes: [
      {
        name: 'National Building Code',
        description: 'Comprehensive regulations for building design and construction in Nigeria',
        url: 'https://www.nigeriabuilding.gov.ng/codes'
      },
      {
        name: 'Lagos State Building Regulations',
        description: 'Specific building requirements for Lagos State',
        url: 'https://lasbca.lagosstate.gov.ng'
      }
    ],
    commonMaterials: [
      {
        name: 'Cement (Portland)',
        description: 'Widely used binding material for construction',
        averageCost: 4500,
        unit: 'per 50kg bag',
        availability: 'high'
      },
      {
        name: 'Laterite',
        description: 'Reddish clay material used traditionally for building',
        averageCost: 35000,
        unit: 'per truckload',
        availability: 'high'
      },
      {
        name: 'Timber (Mahogany, Iroko)',
        description: 'Local hardwoods used for structural elements and finishes',
        averageCost: 3500,
        unit: 'per board',
        availability: 'medium'
      }
    ],
    regions: [
      {
        name: 'South West',
        states: ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti']
      },
      {
        name: 'South East',
        states: ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo']
      },
      {
        name: 'South South',
        states: ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers']
      },
      {
        name: 'North Central',
        states: ['Benue', 'FCT', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau']
      },
      {
        name: 'North East',
        states: ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe']
      },
      {
        name: 'North West',
        states: ['Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Jigawa', 'Sokoto', 'Zamfara']
      }
    ],
    marketInsights: {
      budgetRange: '₦25M - ₦150M',
      inDemandSkills: ['BIM', 'Sustainable Design', 'Cultural Preservation'],
      hotRegions: ['Lagos', 'Abuja', 'Port Harcourt'],
      growthAreas: ['Urban Housing', 'Commercial Centers', 'Cultural Institutions']
    },
    resources: [
      {
        id: 'nbc-guide',
        type: 'guide',
        title: 'Guide to Nigerian Building Code Compliance',
        description: 'Comprehensive guide to understanding and implementing the National Building Code',
        url: '/resources/nigeria/nbc-guide.pdf',
        isFree: true,
        language: ['English']
      },
      {
        id: 'vernacular-design',
        type: 'course',
        title: 'Nigerian Vernacular Design Principles',
        description: 'Learn traditional Nigerian architectural principles and their modern applications',
        url: '/courses/nigeria/vernacular-design',
        isFree: false,
        language: ['English', 'Yoruba']
      }
    ],
    regionalHubs: [
      {
        name: 'Lagos',
        description: 'Nigeria\'s commercial capital with the most architectural firms',
        knownFor: ['High-rises', 'Mixed-use developments', 'Contemporary designs'],
        majorFirms: ['Chronos Studeos', 'HTL Africa', 'James Cubitt Architects'],
        educationalInstitutions: ['University of Lagos', 'Covenant University']
      },
      {
        name: 'Abuja',
        description: 'The planned capital city with a focus on government and institutional buildings',
        knownFor: ['Government buildings', 'Cultural centers', 'Planned communities'],
        majorFirms: ['Design Group Nigeria', 'AD Consulting'],
        educationalInstitutions: ['University of Abuja']
      }
    ],
    theme: {
      primary: '#008751', // Green from Nigerian flag
      secondary: '#ffffff', // White
      accent: '#0a3d62',   // Deep blue
      background: {
        light: '#f5f5f5',
        dark: '#121212'
      }
    }
  };
  
  // Country configurations mapping
  const countryConfigs: Record<string, CountryConfig> = {
    NG: nigeriaConfig,
    // Add more countries as needed
  };
  
  // Helper functions
  export function getCountryConfig(countryCode: string): CountryConfig | null {
    return countryConfigs[countryCode] || null;
  }
  
  export function getAllCountries(): Array<{code: string, name: string, flag: string}> {
    return Object.entries(countryConfigs).map(([code, config]) => ({
      code,
      name: config.name,
      flag: config.flag
    }));
  }