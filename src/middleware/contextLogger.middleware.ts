import { logger } from '../services/loggerService';
import { Request, Response, NextFunction } from 'express';

export function contextLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  // set logger with Request-Id context
  req.logger = logger.child({
    requestId: req.requestId,
  })

  next();
}
