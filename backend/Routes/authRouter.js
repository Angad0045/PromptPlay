const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const validator = require("validator");
const User = require("../Models/userModel");
const { signInWithGoogle } = require("../Middlewares/signInWithGoogle");
const { userAuth } = require("../Middlewares/userAuth");
const authRouter = express.Router();

authRouter.post("/signInWithGoogle", signInWithGoogle);

authRouter.post("/signUpWithEmailPassword", async (req, res) => {
  try {
    const { username, email, password } = req?.body;

    // Field validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Password strength check
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    // Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const addUser = new User({
      name: username,
      email,
      password: hashPassword,
    });

    const newUser = await addUser.save();

    const token = newUser.createJWTToken();

    // Secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const { name, email: userEmail, planType, subscription } = newUser;

    res.status(201).json({
      message: "New user added successfully!",
      data: { name, email: userEmail, planType, subscription },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("SignUp error:", err.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/signInWithEmailPassword", async (req, res) => {
  try {
    const { email, password } = req?.body;

    // Field check
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Email format check
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const checkPassword = await user.verifyPassword(password);
    if (!checkPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = user.createJWTToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const { name, email: userEmail, planType, subscription } = user;
    res.status(200).json({
      message: "User login successfully!",
      data: { name, email: userEmail, planType, subscription },
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("SignIn error:", err.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

authRouter.get("/user", userAuth, async (req, res) => {
  try {
    const { name, email, planType, subscription } = req.user;
    res.status(200).json({
      message: "Success",
      data: { name, email, planType, subscription },
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = authRouter;
