const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.authMiddleware = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      //   req.user = decode;
    } catch (err) {
      //verification -> issue
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token is invalid or missing",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};
