import { Router } from 'express';
export const movieRouter = Router();

import { moviesHandler, movieHandler, movieCommentsHandler, movieCommentsPostHandler } from 'controllers/movies.controller';
import { charactersHandler } from 'controllers/characters.controller';

movieRouter.get('/', moviesHandler);
movieRouter.get('/:movieId', movieHandler);

movieRouter.get('/:movieId/characters', charactersHandler);

movieRouter.get('/:movieEpisodeId/comments', movieCommentsHandler);
movieRouter.post('/:movieEpisodeId/comments', movieCommentsPostHandler);
