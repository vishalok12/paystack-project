import * as uuidV4 from 'uuid/v4';
import { logger } from '../services/loggerService';
import { Request, Response, NextFunction } from 'express';

function generateRequestId() {
  const uniq = uuidV4().slice(9); // slash first 9 chars to make shorter
  return `${uniq}`
}

function getRequestId() {
  // serverIP = serverIP.replace('.', '')
  const reqId = generateRequestId();
  const time = Date.now()

  return `${reqId}-t${time}`;
}

export async function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const reqId = getRequestId()

  logger.debug(`Request Id for the request is ${reqId}`)

  req.requestId = reqId
  res.setHeader('x-request-id', reqId)

  return next()
}


