import { Request, Response, NextFunction } from 'express';
import { getMovies } from 'services/swapiService';
import { ErrorCode } from 'exceptions/errorCode';
import { APIError } from 'exceptions/apiError';

export async function movieValidityMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const movieId = Number(req.params.movieId);
    const movies = await getMovies(req);
    const movie = movies.find(movie => movie.episode_id === movieId);

    if (!movie) {
      throw new APIError(ErrorCode.MovieNotAvailable, `movie with episode id: ${movieId} does not exist`)
    }

    req.movie = movie;

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
