import { Router } from 'express';
import { moviesHandler } from 'controllers/movies.controller';

export const apiRouter = Router();

apiRouter.use('/', moviesHandler);
