import { Request, Response, NextFunction } from 'express';
import { getMovies, Movie, MoviesData, getMovie } from 'services/swapiService';
import { fetchComments, postComment, fetchMovieCommentsCount } from 'services/commentsService';

interface MovieWithComments extends Movie {
  comments_count: string;
}

function movieResponseFn(movieData: MovieWithComments) {
  const {
    title,
    opening_crawl,
    created,
    director,
    producer,
    episode_id,
    comments_count,
  } = movieData;

  return {
    title,
    episode_id,
    opening_crawl,
    created,
    director,
    producer,
    comments_count,
  }
}

function sortMovies(movies: Movie[]): Movie[] {
  movies = movies.sort((m1, m2) => {
    return new Date(m2.created).getTime() - new Date(m1.created).getTime()
  })

  return movies;
}

async function fetchMovieComments(movies: Movie[]): Promise<MovieWithComments[]> {
  const commentsCountPromises = movies.map(movie => {
    return fetchMovieCommentsCount(movie.episode_id);
  })

  const commentsCount = await Promise.all(commentsCountPromises);


  return movies.map((movie, index) => {
    const movieWithComments: MovieWithComments = (movie as MovieWithComments);
    movieWithComments.comments_count = commentsCount[index];

    return movieWithComments;
  });
}

export function moviesHandler(req: Request, res: Response, next: NextFunction) {
  getMovies(req)
    .then(sortMovies)
    .then(fetchMovieComments)
    .then(results => {
      res.send({
        results: results.map(movieResponseFn),
        count: results.length,
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
    .catch(e => {
      next(e);
    });
}

export function movieCommentsHandler(req: Request, res: Response, next: NextFunction) {
  const movieEpisodeId = Number(req.params.movieEpisodeId);
  fetchComments(req, movieEpisodeId)
    .then(comments => {
      res.send({
        results: comments,
        count: comments.count,
      });
    })
    .catch((e: Error) => next(e));
}

export function movieCommentsPostHandler(req: Request, res: Response, next: NextFunction) {
  const movieEpisodeId = Number(req.params.movieEpisodeId);
  const message = req.body.message;

  if (message.length > 500) {
    res.status(400);
    return res.send({
      error: 'message length too long',
    })
  }

  postComment(req, movieEpisodeId, message)
    .then(comment => {
      res.send(comment);
    })
    .catch((e: Error) => next(e));
}
