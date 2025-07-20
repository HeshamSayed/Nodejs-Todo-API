import dotenv from 'dotenv';

dotenv.config();


interface AppConfig {
  port: number;
  nodeEnv: string;
  
  apiPrefix: string;
  corsOrigin: string;
  
  rateLimitWindow: number;
  rateLimitMax: number;
  
  logLevel: string;
}

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  const parsed = value ? parseInt(value, 10) : defaultValue;
  return isNaN(parsed) ? defaultValue : parsed;
};


const getEnvString = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};


export const config: AppConfig = {
  port: getEnvNumber('PORT', 3000),
  nodeEnv: getEnvString('NODE_ENV', 'development'),
  
  apiPrefix: getEnvString('API_PREFIX', '/api/v1'),
  corsOrigin: getEnvString('CORS_ORIGIN', '*'),
  
  rateLimitWindow: getEnvNumber('RATE_LIMIT_WINDOW', 15 * 60 * 1000),
  rateLimitMax: getEnvNumber('RATE_LIMIT_MAX', 100),
  
  logLevel: getEnvString('LOG_LEVEL', 'combined'),
};


export const validateConfig = (): void => {
  const requiredEnvVars: (keyof AppConfig)[] = ['port', 'nodeEnv'];
  
  for (const envVar of requiredEnvVars) {
    if (!config[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  
  if (config.port < 1 || config.port > 65535) {
    throw new Error(`Invalid port number: ${config.port}. Must be between 1 and 65535`);
  }
  
  console.log('✅ Configuration validated successfully');
};

export const { port, nodeEnv, apiPrefix, corsOrigin, rateLimitWindow, rateLimitMax, logLevel } = config;