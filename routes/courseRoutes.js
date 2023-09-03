const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  searchCourse,
  filterCourse,
} = require("../controllers/courseController");

router.route("/").get(getCourses).post(createCourse);
router.get("/search", searchCourse);
router.route("/:title").get(getCourse);
router.get("/filterby/:field", filterCourse);

module.exports = router;
