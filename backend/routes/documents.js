const express = require("express");
const router = express.Router();
const {myDocuments} = require("../controllers/documents");

router.route("/myDocuments").post(myDocuments);


module.exports = router;