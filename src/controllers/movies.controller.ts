import { Request, Response, NextFunction } from 'express';
import { getMovies, Movie } from 'services/swapiService';
import { fetchComments, postComment, fetchMovieCommentsCount } from 'services/commentsService';
import { Comment } from 'models/comments';

interface MovieWithComments extends Movie {
  comments_count: number;
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

function sortComments(comments: Comment[]): Comment[] {
  return comments.sort((c1, c2) => {
    return new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()
  })
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

export async function moviesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const movies = await getMovies(req);
    const sortedMovies = sortMovies(movies);
    const moviesWithComments = await fetchMovieComments(sortedMovies);

    return res.send({
      results: moviesWithComments.map(movieResponseFn),
      count: moviesWithComments.length,
    });
  } catch (e) {
    req.logger.error(`Error while fetching movies. Error: ${e.message}`)
    return next(e);
  }
}

export async function movieHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const movie = req.movie!;
    (movie as MovieWithComments).comments_count = await fetchMovieCommentsCount(movie.episode_id);

    return res.send(movieResponseFn(movie as MovieWithComments));
  } catch (e) {
    return next(e);
  }
}

export async function movieCommentsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const movieEpisodeId = Number(req.params.movieEpisodeId);
    const comments = await fetchComments(req, movieEpisodeId);
    const sortedComments = sortComments(comments);

    return res.send({
      results: sortedComments,
      count: sortedComments.length,
    });
  } catch (e) {
    return next(e);
  }
}

export async function movieCommentsPostHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const movieEpisodeId = Number(req.params.movieEpisodeId);
    const message = req.body.message;

    if (message.length > 500) {
      res.status(400);

      return res.send({
        error: 'message length too long',
      })
    }

    const comment = await postComment(req, movieEpisodeId, message);
    return res.send(comment);
  } catch (e) {
    return next(e);
  }
}
