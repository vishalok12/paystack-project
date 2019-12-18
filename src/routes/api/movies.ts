import { Router } from 'express';
export const moviesRouter = Router();
const movieRouter = Router();

import { moviesHandler, movieHandler, movieCommentsHandler, movieCommentsPostHandler } from 'controllers/movies.controller';
import { charactersHandler } from 'controllers/characters.controller';
import { movieValidityMiddleware } from 'middleware/movieValidity.middleware';

moviesRouter.use('/:movieId', movieValidityMiddleware, movieRouter);

moviesRouter.get('/', moviesHandler);

movieRouter.get('/', movieHandler);

movieRouter.get('/characters', charactersHandler);

movieRouter.get('/comments', movieCommentsHandler);
movieRouter.post('/comments', movieCommentsPostHandler);
