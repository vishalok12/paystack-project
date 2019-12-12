function isEnvTrue(env: string | undefined): boolean {
  if (!env) { return false; }

  if (env === '0' || env === 'false') {
    return false;
  }

  return true;
}

export const METRICS_ENABLED = isEnvTrue(process.env.METRICS_ENABLED) ? true : false
