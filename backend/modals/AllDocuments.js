const mongoose = require("mongoose");

const AllDocuments = new mongoose.Schema({
  roomId: String,
  title: String,
  
});

const AllDocumentsModel = mongoose.model("AllDocuments", AllDocuments);
module.exports = AllDocumentsModel;
