const mongoose = require("mongoose");

const Document = new mongoose.Schema({
  roomId: String,
  email: String,
  data: Array,
  title: String,
});

const DocumentModel = mongoose.model("Document", Document);
module.exports = DocumentModel;
