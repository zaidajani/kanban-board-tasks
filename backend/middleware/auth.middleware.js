const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("Auth Middleware - Received Token:", token ? `${token.substring(0, 15)}...` : "None");

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
