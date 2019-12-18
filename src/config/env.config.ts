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
checkForEnv( process.env.DB_DBNAME);
export const DB_DBNAME = process.env.DB_DBNAME!;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST || 'localhost';

checkForEnv( process.env.REDIS_URL);
export const REDIS_URL = process.env.REDIS_URL!;
export const REDIS_DB = process.env.REDIS_DB || 0;
