import { apiRouter } from './api';
import { Router } from 'express';

export const router = Router();

router.use('/api', apiRouter);
