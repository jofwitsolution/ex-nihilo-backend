const cors = require("cors");
const express = require("express");
const { errorHandler, notFound } = require("../middleware/errorMiddleware");

const enquiryRoutes = require("../routes/enquiryRoutes");
const courseRoutes = require("../routes/courseRoutes");
const homepageRoute = require("../routes/homepage");

module.exports = function (app) {
  app.use(express.json());
  app.use(
    cors({
      origin: [process.env.CLIENT_URL],
      credentials: true,
    })
  );
  app.use("/", homepageRoute);
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/courses", courseRoutes);
  app.use(errorHandler);
  app.use(notFound);
};
