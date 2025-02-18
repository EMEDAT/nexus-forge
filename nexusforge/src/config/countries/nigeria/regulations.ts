// src/config/countries/nigeria/regulations.ts
import { BuildingCode } from '../types';

export const nigerianBuildingCodes: BuildingCode[] = [
  {
    id: 'nbc',
    name: 'National Building Code of Nigeria',
    description: 'Comprehensive guidelines for building design, construction, and materials in Nigeria',
    url: 'https://www.nigeriabuilding.gov.ng/codes',
    enforcementLevel: 'national',
    lastUpdated: '2019'
  },
  {
    id: 'lagos-building',
    name: 'Lagos State Building Control Regulations',
    description: 'Specific regulations for buildings in Lagos State, addressing urban density and local conditions',
    url: 'https://lasbca.lagosstate.gov.ng',
    enforcementLevel: 'state',
    lastUpdated: '2020'
  },
  {
    id: 'abuja-dev-control',
    name: 'Abuja Development Control Regulations',
    description: 'Building and development guidelines for the Federal Capital Territory',
    url: 'https://fcda.gov.ng/development-control',
    enforcementLevel: 'state',
    lastUpdated: '2018'
  },
  {
    id: 'nimasa',
    name: 'NIMASA Maritime Building Codes',
    description: 'Regulations for coastal and maritime constructions',
    url: 'https://nimasa.gov.ng/codes',
    enforcementLevel: 'national',
    lastUpdated: '2017'
  },
  {
    id: 'environmental-impact',
    name: 'Environmental Impact Assessment Regulations',
    description: 'Guidelines for assessing the environmental impact of construction projects',
    url: 'https://environment.gov.ng/eia-regulations',
    enforcementLevel: 'national',
    lastUpdated: '2016'
  }
];