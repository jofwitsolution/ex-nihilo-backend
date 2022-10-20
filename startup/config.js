const config = require("config");

module.exports = function () {
  // console.log(config.get("jwtPrivateKey"));
  // if (!config.get("jwtPrivateKey"))
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
