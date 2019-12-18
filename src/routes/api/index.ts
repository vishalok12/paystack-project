import { Router } from 'express';
import { moviesRouter } from './movies';
export const apiRouter = Router();

apiRouter.use('/movies', moviesRouter);
