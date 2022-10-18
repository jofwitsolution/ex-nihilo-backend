const config = require("config");
const jwt = require("jsonwebtoken");

const generateToken = (id, firstName, lastName, isAdmin) => {
  return jwt.sign(
    { id, firstName, lastName, isAdmin },
    config.get("jwtPrivateKey"),
    {
      expiresIn: "30d",
    }
  );
};

module.exports.generateToken = generateToken;
