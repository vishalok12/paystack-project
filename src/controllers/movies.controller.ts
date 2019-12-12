import { Request, Response } from 'express';

export function moviesHandler(req: Request, res: Response) {
  req.logger.debug('called health route');

  res.send({
    status: 'success',
  })
}
