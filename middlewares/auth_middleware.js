// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../model/users'); // Update this path according to your project structure
const { sendBadResponse } = require('../helpers/helper');

module.exports.authenticateOptionalJWTForUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized - Invalid token' });
    }

    req.user = user; // Attach the user to the request for future use
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized - Invalid token' });
  }
};

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @returns 
 */
module.exports.authenticateOptionalJWTForUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      req.user = user.toJSON()
    }else{
      req.user = null; // Attach the user to the request for future use
    }

    next();
  } catch (error) {
    return sendBadResponse(req,{ msg: 'error on server' }, 500);
  }
};

module.exports.authenticateJWTForAdmin = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userId);
    const jsonUser = user.toJSON();
    if (user?.role != "admin") {
      return sendBadResponse(res, { msg: 'Unauthorized - Invalid token' }, 403);
    }


    req.user = user; // Attach the user to the request for future use
    next();
  } catch (error) {
    return sendBadResponse(res, { msg: 'Unauthorized - Invalid token' }, 500);
  }
};


