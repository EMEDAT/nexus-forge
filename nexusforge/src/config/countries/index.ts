// src/config/countries/index.ts
import { CountryConfig } from './types';
import { nigeriaConfig } from './nigeria';
// Import other country configs as they're created
// import { usaConfig } from './usa';

// Create a map of country codes to configurations
const countryConfigs: Record<string, CountryConfig> = {
  NG: nigeriaConfig,
  // US: usaConfig,
  // Add more countries as they're created
};

// Helper function to get a country configuration by its code
export function getCountryConfig(countryCode: string): CountryConfig | null {
  return countryConfigs[countryCode] || null;
}

// Helper function to get all supported countries
export function getAllCountries(): Array<{ code: string, name: string, flag: string }> {
  return Object.values(countryConfigs).map(config => ({
    code: config.code,
    name: config.name,
    flag: config.flag
  }));
}

// Re-export types and configurations
export * from './types';
export { nigeriaConfig } from './nigeria';
// export { usaConfig } from './usa';