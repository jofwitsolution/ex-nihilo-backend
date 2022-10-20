const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");
const { infoLogger } = require("./errorLogging");

const conn = mongoose.connection;

module.exports.mongodb = function () {
  // const db = config.get("db");
  const db = process.env.MONGO_URI;

  mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  conn.on("error", (err) => infoLogger("Could not connect to MongoDB...", err));
  conn.once("open", () => infoLogger(`Connected to ${db}...`));
};

module.exports.conn = conn;
