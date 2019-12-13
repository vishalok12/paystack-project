import { NextFunction, Request, Response } from 'express';

export enum ErrorTypes {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  FORBIDEN_ERROR,
  UNAUTHORISED_ERROR,
}

export async function errorMiddleware(err: HTTPError, req: Request, res: Response, next: NextFunction) {
  req.logger.error('inside error middleware', { error: err.message });
  res.status(err.status || 500);
  res.json({'error': {
    message: err.message,
  }});
}
