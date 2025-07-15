// Tesla API Configuration Helper
// This file allows developers to set up Tesla API credentials programmatically

import { teslaApi, TeslaConfig } from './teslaApi';

// Configuration interface for easy setup
export interface AppConfig {
  tesla?: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    baseUrl?: string;
    authUrl?: string;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  tesla: {
    // These will be overridden by environment variables or manual configuration
    clientId: 'YOUR_TESLA_CLIENT_ID',
    clientSecret: 'YOUR_TESLA_CLIENT_SECRET',
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/callback` : 'https://localhost:3000/callback',
    baseUrl: 'https://fleet-api.prd.na.vn.cloud.tesla.com',
    authUrl: 'https://auth.tesla.com'
  }
};

// Global configuration state
let appConfig: AppConfig = { ...defaultConfig };

/**
 * Configure Tesla API credentials
 * 
 * Example usage:
 * ```typescript
 * import { configureTeslaApi } from './services/config';
 * 
 * configureTeslaApi({
 *   clientId: 'your_tesla_client_id',
 *   clientSecret: 'your_tesla_client_secret',
 *   redirectUri: 'https://yourdomain.com/callback'
 * });
 * ```
 */
export function configureTeslaApi(config: Partial<TeslaConfig>): void {
  appConfig.tesla = {
    ...appConfig.tesla,
    ...config
  };
  
  // Update global window object for the Tesla API service to read
  if (typeof window !== 'undefined') {
    (window as any).__TESLA_CONFIG__ = {
      TESLA_CLIENT_ID: config.clientId || appConfig.tesla?.clientId,
      TESLA_CLIENT_SECRET: config.clientSecret || appConfig.tesla?.clientSecret,
      TESLA_REDIRECT_URI: config.redirectUri || appConfig.tesla?.redirectUri,
      TESLA_API_BASE_URL: config.baseUrl || appConfig.tesla?.baseUrl,
      TESLA_AUTH_URL: config.authUrl || appConfig.tesla?.authUrl
    };
  }
  
  console.log('Tesla API configuration updated');
}

/**
 * Get current Tesla API configuration status
 */
export function getTeslaConfigStatus(): {
  configured: boolean;
  missingFields: string[];
} {
  const config = appConfig.tesla;
  const missingFields: string[] = [];
  
  if (!config?.clientId || config.clientId === 'YOUR_TESLA_CLIENT_ID') {
    missingFields.push('clientId');
  }
  
  if (!config?.clientSecret || config.clientSecret === 'YOUR_TESLA_CLIENT_SECRET') {
    missingFields.push('clientSecret');
  }
  
  return {
    configured: missingFields.length === 0,
    missingFields
  };
}

/**
 * Setup instructions for Tesla API
 */
export const TESLA_SETUP_INSTRUCTIONS = {
  steps: [
    'Visit https://developer.tesla.com/ and create a developer account',
    'Create a new Tesla App in the developer console',
    'Copy your Client ID and Client Secret',
    'Set your Redirect URI (e.g., https://yourdomain.com/callback)',
    'Configure the credentials using configureTeslaApi() or environment variables'
  ],
  
  environmentVariables: [
    'TESLA_CLIENT_ID=your_tesla_client_id',
    'TESLA_CLIENT_SECRET=your_tesla_client_secret',
    'TESLA_REDIRECT_URI=https://yourdomain.com/callback'
  ],
  
  programmaticSetup: `
import { configureTeslaApi } from './services/config';

configureTeslaApi({
  clientId: 'your_tesla_client_id',
  clientSecret: 'your_tesla_client_secret',
  redirectUri: 'https://yourdomain.com/callback'
});
  `.trim()
};

// Export current configuration for debugging
export function getAppConfig(): AppConfig {
  return { ...appConfig };
}

// Check if we're in development mode and log helpful information
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const status = getTeslaConfigStatus();
  if (!status.configured) {
    console.group('🚗 EV Connect - Tesla API Setup');
    console.log('Tesla API is not configured. Missing:', status.missingFields.join(', '));
    console.log('📖 Setup instructions:', TESLA_SETUP_INSTRUCTIONS.steps);
    console.log('💻 Programmatic setup:', TESLA_SETUP_INSTRUCTIONS.programmaticSetup);
    console.groupEnd();
  } else {
    console.log('🚗 Tesla API is configured and ready!');
  }
}