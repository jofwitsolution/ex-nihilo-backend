const cors = require("cors");
const express = require("express");
const { errorHandler, notFound } = require("../middleware/errorMiddleware");
const userRoutes = require("../routes/userRoutes");
const emailRoutes = require("../routes/emailRoutes");
const courseRoutes = require("../routes/courseRoutes");

module.exports = function (app) {
  app.use(express.json());
  // app.use(cors());
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  app.use("/api/users", userRoutes);
  app.use("/api/email", emailRoutes);
  app.use("/api/courses", courseRoutes);
  app.use(errorHandler);
  app.use(notFound);
};
