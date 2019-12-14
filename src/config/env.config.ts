function isEnvTrue(env: string | undefined): boolean {
  if (!env) { return false; }

  if (env === '0' || env === 'false') {
    return false;
  }

  return true;
}

export const METRICS_ENABLED = isEnvTrue(process.env.METRICS_ENABLED) ? true : false

export const DB_USERNAME = process.env.DB_USERNAME
export const DB_PASSWORD = process.env.DB_PASSWORD
