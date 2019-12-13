import { Request, Response, NextFunction } from 'express';
import { getMovies, Movie, MoviesData, getMovie } from 'services/swapiService';

function movieResponseFn(movieData: Movie) {
  const {
    title,
    opening_crawl,
    created,
    director,
    producer,
    episode_id,
  } = movieData;

  return {
    title,
    episode_id,
    opening_crawl,
    created,
    director,
    producer,
  }
}

function sortMovies(movies: MoviesData): MoviesData {
  movies.results = movies.results.sort((m1, m2) => {
    return new Date(m2.created).getTime() - new Date(m1.created).getTime()
  })

  return movies;
}

export function moviesHandler(req: Request, res: Response, next: NextFunction) {
  getMovies(req)
    .then(sortMovies)
    .then(response => {
      res.send({
        results: response.results.map(movieResponseFn),
        count: response.count,
      })
    })
    .catch(e => {
      req.logger.error(`Error while fetching movies. Error: ${e.message}`)
      next(e);
    });
}

export function movieHandler(req: Request, res: Response, next: NextFunction) {
  getMovie(req, req.params.movieId)
    .then(response => {
      res.send(movieResponseFn(response));
    })
}
