const express = require("express");
const router = express.Router();
const {sendMail} = require("../controllers/share");

router.route("/sendMail").post(sendMail);


module.exports = router;