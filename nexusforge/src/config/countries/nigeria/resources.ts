// src/config/countries/nigeria/resources.ts
import { Resource } from '../types';

export const nigerianResources: Resource[] = [
  {
    id: 'nbc-guide',
    type: 'guide',
    title: 'Guide to Nigerian Building Code Compliance',
    description: 'Comprehensive guide to understanding and implementing the National Building Code in Nigeria',
    url: '/resources/nigeria/nbc-guide.pdf',
    isFree: true,
    language: ['English']
  },
  {
    id: 'sustainable-design',
    type: 'course',
    title: 'Sustainable Design for Nigerian Climate',
    description: 'Online course focusing on climate-responsive and sustainable architectural design in Nigeria',
    url: 'https://nexusforge.edu/courses/sustainable-nigeria',
    isFree: false,
    language: ['English']
  },
  {
    id: 'traditional-techniques',
    type: 'webinar',
    title: 'Traditional Nigerian Building Techniques in Modern Architecture',
    description: 'Webinar on incorporating traditional Yoruba, Igbo, and Hausa building methods in contemporary designs',
    url: '/resources/webinars/traditional-techniques.mp4',
    isFree: true,
    language: ['English', 'Yoruba', 'Hausa']
  },
  {
    id: 'cost-estimation',
    type: 'tool',
    title: 'Nigerian Construction Cost Calculator',
    description: 'Tool for estimating construction costs based on current material prices in different Nigerian states',
    url: '/tools/nigeria-cost-calculator',
    isFree: false,
    language: ['English']
  },
  {
    id: 'residential-template',
    type: 'template',
    title: 'Nigerian Residential Project Templates',
    description: 'Collection of design templates for common residential projects in Nigeria',
    url: '/resources/templates/nigeria-residential.zip',
    isFree: true,
    language: ['English']
  },
  {
    id: 'lagos-urban-planning',
    type: 'guide',
    title: 'Urban Planning Guidelines for Lagos Metropolitan Area',
    description: 'Comprehensive guide to urban planning regulations and best practices in Lagos',
    url: '/resources/nigeria/lagos-urban-planning.pdf',
    isFree: true,
    language: ['English']
  },
  {
    id: 'vernacular-architecture',
    type: 'course',
    title: 'Nigerian Vernacular Architecture Studies',
    description: 'In-depth course on regional architectural styles across Nigeria',
    url: 'https://nexusforge.edu/courses/nigerian-vernacular',
    isFree: false,
    language: ['English', 'Yoruba', 'Igbo', 'Hausa']
  }
];