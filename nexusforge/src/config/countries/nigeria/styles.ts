// src/config/countries/nigeria/styles.ts
import { ArchitecturalStyle } from '../types';

export const nigerianArchitecturalStyles: ArchitecturalStyle[] = [
  {
    id: 'traditional-yoruba',
    name: 'Traditional Yoruba Architecture',
    description: 'Indigenous architectural style of the Yoruba people, emphasizing communal living and cultural values',
    keyFeatures: [
      'Courtyard designs',
      'Impluvium roofing',
      'Mud brick construction',
      'Carved wooden elements',
      'Adaptive cooling systems'
    ],
    imageUrl: '/images/architecture/nigeria/yoruba-traditional.jpg',
    examples: [
      {
        name: 'Afin Oyo (Oyo Palace)',
        location: 'Oyo State',
        image: '/images/architecture/nigeria/afin-oyo.jpg',
        description: 'Historic palace showcasing traditional Yoruba architectural principles',
        year: 'Traditional, renovated over centuries'
      },
      {
        name: 'Osun-Osogbo Sacred Grove',
        location: 'Osogbo, Osun State',
        image: '/images/architecture/nigeria/osun-osogbo.jpg',
        description: 'UNESCO World Heritage site featuring traditional Yoruba architecture and sculptures',
        year: 'Traditional, structures dating from 15th century'
      }
    ]
  },
  {
    id: 'hausa-fulani',
    name: 'Hausa-Fulani Architecture',
    description: 'Architecture from Northern Nigeria featuring distinctive domed structures and geometric patterns',
    keyFeatures: [
      'Adobe construction',
      'Distinctive domed structures',
      'Thick walls for thermal insulation',
      'Geometric decorative patterns',
      'Minimal windows for climate control'
    ],
    imageUrl: '/images/architecture/nigeria/hausa-traditional.jpg',
    examples: [
      {
        name: 'Kano Old City Walls and Gates',
        location: 'Kano State',
        image: '/images/architecture/nigeria/kano-walls.jpg',
        description: 'Ancient defensive structures built with traditional Hausa building techniques',
        year: '15th-18th century'
      },
      {
        name: 'Zaria Friday Mosque',
        location: 'Zaria, Kaduna State',
        image: '/images/architecture/nigeria/zaria-mosque.jpg',
        description: 'Historic mosque featuring traditional Hausa-Fulani architectural elements',
        year: 'Traditional, renovated multiple times'
      }
    ]
  },
  {
    id: 'colonial',
    name: 'Colonial Architecture',
    description: 'Architecture introduced during the British colonial period, blending European and local elements',
    periodStart: '1861',
    periodEnd: '1960',
    keyFeatures: [
      'Symmetrical facades',
      'Columned entrances',
      'High ceilings',
      'Large windows for ventilation',
      'Verandas'
    ],
    imageUrl: '/images/architecture/nigeria/colonial-style.jpg',
    examples: [
      {
        name: 'Carter Bridge House',
        location: 'Lagos',
        image: '/images/architecture/nigeria/carter-bridge.jpg',
        description: 'Built in the late 19th century, features colonial style with local adaptations',
        year: '1880s'
      },
      {
        name: 'First Bank Building',
        location: 'Marina, Lagos',
        image: '/images/architecture/nigeria/first-bank.jpg',
        description: 'Historic banking building with characteristic colonial architecture',
        year: '1890s'
      }
    ]
  },
  {
    id: 'modern-tropical',
    name: 'Modern Tropical',
    description: 'Contemporary architecture adapted to Nigeria\'s tropical climate with sustainable features',
    periodStart: '1960',
    keyFeatures: [
      'Cross ventilation',
      'Shaded areas',
      'Solar panels',
      'Rainwater harvesting',
      'Local material usage',
      'Climate-responsive design'
    ],
    imageUrl: '/images/architecture/nigeria/modern-tropical.jpg',
    examples: [
      {
        name: 'Nestoil Towers',
        location: 'Victoria Island, Lagos',
        image: '/images/architecture/nigeria/nestoil-towers.jpg',
        description: 'Modern high-rise building with climate-responsive design elements',
        year: '2016',
        architect: 'ACCL'
      },
      {
        name: 'NECOM House',
        location: 'Marina, Lagos',
        image: '/images/architecture/nigeria/necom-house.jpg',
        description: 'One of the earliest modern skyscrapers in Nigeria, adapted for tropical climate',
        year: '1979'
      }
    ]
  }
];