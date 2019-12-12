import * as winston from 'winston';
const { combine, timestamp } = winston.format;

// export const logger = new (winston.Logger)({
//   transports: [
//     new (winston.transports.Console)({
//       timestamp() {
//         const offset = 5.5; // IST
//         return new Date(new Date().getTime() + offset * 3600 * 1000).toUTCString().replace(/ GMT$/, '');
//       },
//       level: process.env.LOG_LEVEL || 'debug',
//     }),
//   ],
// });

export const logger = winston.createLogger({
  silent: process.env.NODE_ENV === 'test',
  level: 'info',
  format: combine(
    timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({ level: process.env.LOG_LEVEL || 'debug' }),
  ],
});
