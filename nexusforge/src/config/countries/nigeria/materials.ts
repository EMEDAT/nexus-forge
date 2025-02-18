// src/config/countries/nigeria/materials.ts
import { Material } from '../types';

export const nigerianMaterials: Material[] = [
  {
    id: 'cement',
    name: 'Cement (Portland)',
    description: 'Widely used binding material for construction in Nigeria, with local and imported options',
    localCost: {
      amount: 4500,
      unit: 'per 50kg bag'
    },
    availability: 'high',
    sustainabilityRating: 2,
    commonUses: ['Concrete structures', 'Mortar for brickwork', 'Rendering', 'Floor screeds'],
    suppliers: [
      {
        name: 'Dangote Cement',
        location: 'Nationwide',
        website: 'https://dangotecement.com'
      },
      {
        name: 'Lafarge Africa',
        location: 'Nationwide',
        website: 'https://lafarge.com.ng'
      }
    ]
  },
  {
    id: 'laterite',
    name: 'Laterite',
    description: 'Reddish clay material used traditionally for building in many parts of Nigeria',
    localCost: {
      amount: 35000,
      unit: 'per truckload'
    },
    availability: 'high',
    sustainabilityRating: 4,
    commonUses: ['Traditional walls', 'Compressed earth blocks', 'Road construction', 'Landscaping']
  },
  {
    id: 'timber',
    name: 'Timber (Mahogany, Iroko)',
    description: 'Local hardwoods used for structural elements and finishes',
    localCost: {
      amount: 3500,
      unit: 'per board'
    },
    availability: 'medium',
    sustainabilityRating: 3,
    commonUses: ['Roof trusses', 'Door frames', 'Window frames', 'Flooring', 'Furniture']
  },
  {
    id: 'sandcrete-blocks',
    name: 'Sandcrete Blocks',
    description: 'Common building blocks made from cement, sand and water',
    localCost: {
      amount: 350,
      unit: 'per 9-inch block'
    },
    availability: 'high',
    sustainabilityRating: 2,
    commonUses: ['External walls', 'Internal partitions', 'Boundary walls']
  },
  {
    id: 'bamboo',
    name: 'Bamboo',
    description: 'Sustainable fast-growing construction material gaining popularity',
    localCost: {
      amount: 500,
      unit: 'per pole'
    },
    availability: 'medium',
    sustainabilityRating: 5,
    commonUses: ['Scaffolding', 'Roof structures', 'Decorative elements', 'Sustainable housing']
  },
  {
    id: 'metal-roofing',
    name: 'Corrugated Metal Roofing',
    description: 'Popular roofing material that withstands heavy rains',
    localCost: {
      amount: 3000,
      unit: 'per sheet'
    },
    availability: 'high',
    sustainabilityRating: 3,
    commonUses: ['Residential roofing', 'Commercial structures', 'Temporary buildings']
  },
  {
    id: 'granite',
    name: 'Granite',
    description: 'Durable stone used for high-end construction and finishes',
    localCost: {
      amount: 4500,
      unit: 'per square meter'
    },
    availability: 'medium',
    sustainabilityRating: 3,
    commonUses: ['Flooring', 'Countertops', 'External cladding', 'Decorative elements']
  }
];