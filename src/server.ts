#!/usr/bin/env node

/**
 * Module dependencies.
 */
require('app-module-path').addPath(__dirname);
import { app } from './app';
import { logger } from './services/loggerService';
// var http = require('http');

import * as http from 'http';
import { sequelize } from './models/comments';
import { getRedisClient } from './services/redisService';

const port = normalizePort(process.env.PORT || '3000');

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
    await getRedisClient();
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
      : (addr !== null ? 'port ' + addr.port : '');
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


setupApp();
