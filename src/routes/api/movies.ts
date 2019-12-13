import { Router } from 'express';
export const movieRouter = Router();

import { moviesHandler, movieHandler } from 'controllers/movies.controller';

movieRouter.get('/', moviesHandler);
movieRouter.get('/:movieId', movieHandler);
