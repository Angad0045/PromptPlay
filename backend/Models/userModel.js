const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email id`,
      },
    },
    password: {
      type: String,
      trim: true,
      validate: {
        validator: validator.isStrongPassword,
        message: "Your password is weak, enter a strong password",
      },
    },
    picture: { type: String, default: null },

    planType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    subscription: {
      planId: { type: String, default: null },
      subscriptionId: { type: String, default: null },
      status: {
        type: String,
        enum: [
          "active",
          "trialing",
          "canceled",
          "incomplete",
          "past_due",
          "unpaid",
          "none",
        ],
        default: "none",
      },
    },
    customer: {
      id: { type: String, default: null },
    },
  },
  { timestamps: true },
);

//Function to create JWT token
UserSchema.methods.createJWTToken = function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TIMEOUT || "12h",
    },
  );

  return token;
};

//Function to verify user's password
UserSchema.methods.verifyPassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;

  const checkPassword = await bcrypt.compare(passwordInputByUser, hashPassword);

  return checkPassword;
};

module.exports = mongoose.model("User", UserSchema);
