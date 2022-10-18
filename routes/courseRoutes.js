const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  searchCourse,
} = require("../controllers/courseController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(getCourses).post(createCourse);
router.route("/:title").get(getCourse);
router.get("/search", searchCourse);

module.exports = router;
