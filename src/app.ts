// Why require!! Issue: https://github.com/expressjs/express/issues/3263
import express = require('express');
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { requestIdMiddleware } from './middleware/requestId.middleware';
import { contextLoggerMiddleware } from './middleware/contextLogger.middleware';

import { errorMiddleware } from './middleware/error.middleware';
import { router } from './routes';

import { metricsMiddleware } from './middleware/metrics.middleware';

export const app = express();

app.disable('x-powered-by');

morgan.token('reqId', function getId(req: Request) {
  return req.requestId
})

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('ACCESS-LOG: :reqId :remote-addr - :remote-user [:date[clf]] ":method :url :req[host] HTTP/:http-version" :status :res[Location] :res[content-length] ":referrer" ":user-agent" - :response-time ms'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(metricsMiddleware);
app.use(requestIdMiddleware);
app.use(contextLoggerMiddleware);

app.use(router);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  const err: HTTPError = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorMiddleware);
