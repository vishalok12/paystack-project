import { Router } from 'express';

export const characterRouter = Router();

import { charactersHandler } from 'controllers/characters.controller';

characterRouter.get('/', charactersHandler);
