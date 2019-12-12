import { Request, Response, NextFunction } from 'express';
import { METRICS_ENABLED } from '../config/env.config';
import { getHistogram } from '../services/metrics';
import onFinished = require('on-finished');

function getHTTPDurationSecondsMetrics() {
  return getHistogram('http_duration_seconds', 'http duration seconds', {
    buckets: [0.5, 1, 2, 5, 10],
    labelNames: ['status'],
  });
}

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (METRICS_ENABLED) {
    const histogram = getHTTPDurationSecondsMetrics();
    const end = histogram.startTimer();

    onFinished(res, () => {
      end({ status: res.statusCode.toString() });
    });
  }

  return next();
}
