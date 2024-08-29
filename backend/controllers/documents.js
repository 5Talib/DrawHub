const Document = require("../modals/Document");

const myDocuments = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const documents = await Document.find({ email: email });
      return res.status(200).json(documents);
    }
  } catch (error) {
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
};

module.exports = { myDocuments };
