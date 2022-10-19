const express = require("express");
const router = express.Router();
const {
  receiveGeneralEnquiry,
  receiveCourseEnquiry,
} = require("../controllers/enquiryController");

router.route("/general").post(receiveGeneralEnquiry);
router.route("/course").post(receiveCourseEnquiry);

module.exports = router;
