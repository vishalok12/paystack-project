import { Router } from 'express';
import { movieRouter } from './movies';
export const apiRouter = Router();

apiRouter.use('/movies', movieRouter);
