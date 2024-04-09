const User = require("../modals/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      return res
        .status(401)
        .json({ error: "A user already exists with this email" });
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = await newUser.generateToken();
    const userToReturn = { ...newUser.toJSON(), token };
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
  } catch (error) {
    res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ err: "Invalid Credentials" });
    }
    const isPasswordValid = await user.comparePassword(password);

    if (isPasswordValid) {
      const token = await user.generateToken();
      const userToReturn = { ...user.toJSON(), token };
      delete userToReturn.password;
      return res.status(200).json(userToReturn);
    } else {
      return res.status(401).json({ err: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
};

const getCurrentUser = async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, user) {
    if (err) {
      return res.status(200).json({ isAuth: 0 });
    } else {
      user.isAuth = 1;
      const userRecord = await User.findOne({ email: user.email });
      if (userRecord) {
        const { name } = userRecord;
        user.name = name;
      }
      console.log("TokenDetails: ", user);
      return res.status(200).json(user);
    }
  });
};

module.exports = { register, login, getCurrentUser };
