const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from cookie or header
  let token = req.cookies.token;
  
  // If no cookie token, check authorization header
  if (!token && req.headers.authorization) {
    // Format: "Bearer [token]"
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
