const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { sendEmail, receiveEmail } = require("../controllers/emailController");

router.route("/").post(protect, admin, sendEmail);
router.route("/receive-email").post(receiveEmail);

module.exports = router;
