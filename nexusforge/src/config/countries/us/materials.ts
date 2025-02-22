// src\config\countries\us\materials.ts

import { Material } from '../types';

export const usMaterials: Material[] = [
  {
    id: 'us-lumber',
    name: 'Dimensional Lumber',
    description: 'Standardized wood for construction',
    localCost: {
      amount: 5,
      unit: 'per linear foot'
    },
    availability: 'high',
    sustainabilityRating: 3,
    commonUses: [
      'Framing',
      'Structural support',
      'Residential construction'
    ]
  }
];