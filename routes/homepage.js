const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //   res.write("This is Ex-Nihilo backend");
  res.send("This is Ex-Nihilo backend");
});

module.exports = router;
