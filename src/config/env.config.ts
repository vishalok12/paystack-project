import { logger } from 'services/loggerService';

function isEnvTrue(env: string | undefined): boolean {
  if (!env) { return false; }

  if (env === '0' || env === 'false') {
    return false;
  }

  return true;
}

function checkForEnv(env: string | undefined) {
  if (!env) {
    logger.error(`Please provide required environment variable`);
    process.exit(1);
  }
}

export const METRICS_ENABLED = isEnvTrue(process.env.METRICS_ENABLED) ? true : false

checkForEnv( process.env.DB_USERNAME);
export const DB_USERNAME = process.env.DB_USERNAME!;
export const DB_PASSWORD = process.env.DB_PASSWORD;

checkForEnv( process.env.REDIS_HOST);
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;
export const REDIS_DB = process.env.REDIS_DB || 0;
