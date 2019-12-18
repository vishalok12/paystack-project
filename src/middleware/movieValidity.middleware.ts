import { Request, Response, NextFunction } from 'express';
import { getMovie } from 'services/swapiService';
import { ErrorCode } from 'exceptions/errorCode';

export async function movieValidityMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // set logger with Request-Id context
    req.movie = await getMovie(req, req.params.movieId);

    next();
  } catch (error) {
    if (error.errorCode === ErrorCode.MovieNotAvailable) {
      error.status = 404;
      return next(error);
    }

    error.status = 500;
    return next(error);
  }
}
