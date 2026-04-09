const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header("x-auth-token");

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ message: "No token, authorisation denied" });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user data (ID and role) to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
