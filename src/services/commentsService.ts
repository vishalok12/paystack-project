import { Comment, MovieComments } from 'models/comments';
import { Request } from 'express';

export function fetchComments(req: Request, movieEpisodeId: number) {
  return Comment.findAll({
    where: {
      movieEpisodeId,
    },
  }).then(comments => {
    return comments;
  })
}

export async function postComment(req: Request, movieEpisodeId: number, message: string) {
  const comment = await Comment.create({
    message,
    movieEpisodeId: movieEpisodeId,
    ipAddress: req.ip,
  })

  const movieComment = await MovieComments.findOne({
    where: {
      movieEpisodeId,
    },
  })

  if (!movieComment) {
    await MovieComments.create({
      movieEpisodeId: movieEpisodeId,
      commentsCount: 1,
    })
  } else {
    await MovieComments.update({
      commentsCount: movieComment.commentsCount + 1,
    }, {
      where: {
        movieEpisodeId,
      },
    })
  }

  return comment;
}

export async function fetchMovieCommentsCount(movieEpisodeId: number) {
  const movieComments = await MovieComments.findOne({
    where: {
      movieEpisodeId,
    },
  });

  if (!movieComments) return 0;

  return movieComments.commentsCount;
}
