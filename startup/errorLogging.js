require("express-async-errors");
const winston = require("winston");
const config = require("config");

// const db = config.get("db");

module.exports.errorLogger = function () {
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "error",
    format: winston.format.json(),
    exitOnError: false,
    transports: [new winston.transports.Console()],
    exceptionHandlers: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "exceptions.log" }),
    ],
    rejectionHandlers: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "rejections.log" }),
    ],
  });
};

module.exports.infoLogger = function (message, err) {
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.prettyPrint(),
    exitOnError: false,
    transports: [new winston.transports.Console()],
  });

  logger.info(message, err);
};
