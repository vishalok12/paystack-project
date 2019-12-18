import { Comment, MovieComments } from 'models/comments';
import { Request } from 'express';

export async function fetchComments(req: Request, movieId: number) {
  const comments = await Comment.findAll({
    where: {
      movieId,
    },
  })

  return comments;
}

export async function postComment(req: Request, movieId: number, message: string) {
  const comment = await Comment.create({
    message,
    movieId: movieId,
    ipAddress: req.ip,
  })

  const movieComment = await MovieComments.findOne({
    where: {
      movieId,
    },
  })

  if (!movieComment) {
    await MovieComments.create({
      movieId: movieId,
      commentsCount: 1,
    })
  } else {
    await MovieComments.update({
      commentsCount: movieComment.commentsCount + 1,
    }, {
      where: {
        movieId,
      },
    })
  }

  return comment;
}

export async function fetchMovieCommentsCount(movieId: number) {
  const movieComments = await MovieComments.findOne({
    where: {
      movieId,
    },
  });

  if (!movieComments) return 0;

  return movieComments.commentsCount;
}
