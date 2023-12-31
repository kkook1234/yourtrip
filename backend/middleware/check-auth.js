const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'

    if (!token) {
      const error = new Error("인증에 실패했습니다");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("인증에 실패했습니다", 401);
    return next(error);
  }
};
