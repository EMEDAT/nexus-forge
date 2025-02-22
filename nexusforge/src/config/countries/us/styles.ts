// src\config\countries\us\styles.ts

import { ArchitecturalStyle } from '../types';

export const usArchitecturalStyles: ArchitecturalStyle[] = [
  {
    id: 'us-colonial',
    name: 'Colonial Revival',
    description: 'Inspired by early American architectural traditions',
    periodStart: '1880',
    periodEnd: '1955',
    keyFeatures: [
      'Symmetrical facade',
      'Decorative door surrounds',
      'Multi-pane windows',
      'Pitched roof',
      'Columns and porticos'
    ],
    examples: [
      {
        name: 'Mount Vernon',
        location: 'Virginia',
        year: '1758',
        description: 'Home of George Washington',
        architect: 'George Washington'
      }
    ]
  }
];