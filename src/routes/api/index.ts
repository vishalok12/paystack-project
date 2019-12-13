import { Router } from 'express';
import { movieRouter } from './movies';
import { characterRouter } from './characters';
export const apiRouter = Router();

apiRouter.use('/movies', movieRouter);
apiRouter.use('/characters', characterRouter);
