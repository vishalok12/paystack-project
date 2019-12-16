#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('app-module-path').addPath(__dirname);
import * as cluster from 'cluster';
import { app } from './app';
import { logger } from './services/loggerService';
// var http = require('http');
import { AggregatorRegistry } from 'prom-client';
import * as express from 'express';

import * as http from 'http';
import { sequelize } from 'models/comments';

const port = normalizePort(process.env.PORT || '3000');
const aggregatorRegistry = new AggregatorRegistry();

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const workers: Array<cluster.Worker> = [];

/**
 * Setup number of worker processes to share port which will be defined while setting up server
 */
const setupWorkerProcesses = () => {
  const metricsServer = express();
  // to read number of cores on system
  const numCores = require('os').cpus().length;
  logger.info('Master cluster setting up ' + numCores + ' workers');

  // iterate on number of cores need to be utilized by an application
  // current example will utilize all of them
  for (let i = 0; i < numCores; i++) {
    // creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());
  }

  // process is clustered on a core and process id is assigned
  cluster.on('online', function (worker) {
    logger.info('Worker ' + worker.process.pid + ' is listening');
  });

  // if any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function (worker, code, signal) {
    logger.info('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    logger.info('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[workers.length - 1].on('message', function (message) {
      logger.info(message);
    });
  });

  // Handle metrics aggregation
  metricsServer.get('/cluster_metrics', (req: express.Request, res: express.Response) => {
    aggregatorRegistry.clusterMetrics((err, metrics) => {
      if (err) logger.error(err);
      res.set('Content-Type', aggregatorRegistry.contentType);
      res.send(metrics);
    });
  });

  const metricsPort = Number(process.env.METRICS_PORT || 3001);

  metricsServer.listen(metricsPort);
  logger.info(`Cluster metrics server listening to ${metricsPort}, metrics exposed on /cluster_metrics`);
};

const setupApp = async () => {
  /**
   * Get port from environment and store in Express.
   */

  app.set('port', port);

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  try {
    await sequelize.sync();
    server.listen(port);
    server.on('error', onError);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    logger.info(`Server running on PORT: ${bind} with env: ${process.env.NODE_ENV}`);
  });

  process.on('SIGINT', () => {
    logger.info('Closing server...')

    server.close(() => {
      logger.info('Server closed !!!')
      process.exit()
    })

    // Force close server after 5secs
    setTimeout(() => {
      logger.info('Forcing server close !!!')

      process.exit(1);
    }, 10000)
  })

  process.on('uncaughtException', err => {
    logger.error(`unhandled error: ${err}`)
    process.exit(1)
  })
}

/**
 * Setup server either with clustering or without it
 * @param isClusterRequired
 * @constructor
 */
const setupServer = () => {
  const isClusterRequired = process.env.CLUSTER_MODE === '1';

  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // to setup server configurations and share port address for incoming requests
    setupApp();
  }
};

setupServer();
