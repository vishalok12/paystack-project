import { NextFunction, Request, Response } from 'express';
import { ErrorCode } from 'exceptions/errorCode';

export async function errorMiddleware(err: HTTPError, req: Request, res: Response, next: NextFunction) {
  req.logger.error('inside error middleware', { error: err.message });
  res.status(err.status || 500);
  res.json({'error': {
    message: err.message,
    errorCode: err.errorCode || ErrorCode.InternalServerError,
  }});
}
