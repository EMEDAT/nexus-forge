// src\config\countries\us\regulations.ts

import { BuildingCode } from '../types';

export const usBuildingCodes: BuildingCode[] = [
  {
    id: 'us-ibc',
    name: 'International Building Code',
    description: 'Comprehensive building safety and construction standards',
    url: 'https://codes.iccsafe.org/content/IBC2018',
    enforcementLevel: 'national',
    lastUpdated: '2018'
  }
];