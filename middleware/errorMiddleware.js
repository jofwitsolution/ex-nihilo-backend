const { infoLogger } = require("../startup/errorLogging");

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // if the status code is 200, the problem is internal server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  infoLogger(err.message, err);
  res.status(statusCode);
  res.json({
    message: err.message,
  });
};

module.exports.notFound = notFound;
module.exports.errorHandler = errorHandler;
