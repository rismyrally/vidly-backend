const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');
const { createLogger, format, transports } = winston;
const { combine, colorize, errors, prettyPrint, timestamp, printf } = format;

const consolePrint = printf(({ level, message, timestamp, stack }) => {
  let msg = colorize().colorize(
    level,
    `${timestamp} [${level.toUpperCase()}] : ${message}`
  );
  if (stack) msg += ` - ${stack}`;
  return msg;
});

const consoleLogFormat = combine(consolePrint);
const fileLogFormat = combine(
  errors({ stack: true }),
  timestamp(),
  prettyPrint()
);

const getFileTransport = (filename) => new transports.File({ filename });

const consoleTransport = new transports.Console({ format: consoleLogFormat });
const exceptionHandlers = [
  consoleTransport,
  getFileTransport('uncaughtExceptions.log'),
];
const rejectionHandlers = [
  consoleTransport,
  getFileTransport('unhandledRejections.log'),
];

const logOptions = {
  level: 'debug',
  format: fileLogFormat,
  transports: [
    new transports.File({ filename: 'logfile.log', level: 'debug' }),
    // new transports.MongoDB({
    //   db: 'mongodb://localhost/vidly',
    //   options: { useUnifiedTopology: true },
    //   level: 'error',
    // }),
  ],
  exceptionHandlers,
  rejectionHandlers,
};

const logger = createLogger(logOptions);

if (process.env.NODE_ENV !== 'production') {
  logger.add(consoleTransport);
}

module.exports = logger;
