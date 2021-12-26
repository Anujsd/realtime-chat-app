const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

const protectedPath = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decodedString = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decodedString.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not Authorized ,token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = protectedPath;
