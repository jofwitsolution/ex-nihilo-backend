const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.use(helmet()); // protect the app from web vulnerabilities
  app.use(
    compression({
      level: 6,
      threshold: 0,
    })
  ); // compress the route handlers
};
