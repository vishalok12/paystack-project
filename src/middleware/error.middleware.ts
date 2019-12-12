import { NextFunction, Request, Response } from 'express';

export enum ErrorTypes {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST_ERROR,
  FORBIDEN_ERROR,
  UNAUTHORISED_ERROR,
}

export async function errorMiddleware(err: HTTPError, req: Request, res: Response, next: NextFunction) {
  req.logger.error('inside error middleware', { error: err.message });
  res.writeHead(500, {
    'content-type': 'application/json',
  });
  return res.send({
    error: {
      message: err.message,
    },
  });
}
