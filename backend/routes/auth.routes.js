const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const auth = require("../middleware/auth.middleware");


const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", 
  };

  res.cookie("token", token, cookieOptions);

  
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse,
  });
};




router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const normalizedEmail = email.toLowerCase();

    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      tasks: [],
    });

    await newUser.save();

    sendToken(newUser, 201, res);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});




router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const normalizedEmail = email.toLowerCase();

    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});




router.get("/me", auth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error while fetching user info" });
  }
});




router.post("/logout", (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000), 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;