const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await userModel.findById(_id);
    if (!user) return res.status(401).send("Unauthorized");

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).send("Unauthorized");
    }
    res.status(500).send("Something went wrong");
  }
};

module.exports = { userAuth };
