import { Router } from 'express';
export const movieRouter = Router();

import { moviesHandler, movieHandler, movieCommentsHandler, movieCommentsPostHandler } from 'controllers/movies.controller';

movieRouter.get('/', moviesHandler);
movieRouter.get('/:movieId', movieHandler);
movieRouter.get('/:movieEpisodeId/comments', movieCommentsHandler);
movieRouter.post('/:movieEpisodeId/comments', movieCommentsPostHandler);
