const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

User.pre("save", async function () {
  if (!this.isModified) {
    return next();
  }

  try {
    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, genSalt);
    this.password = hashPassword;
  } catch (error) {
    console.log(error);
  }
});

User.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '24h',
      }
    );
  } catch (error) {
    console.error("token error: ", error);
  }
};

User.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error("password not match: ", error);
  }
};

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
