const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
const { authMessages, status } = require('../messages');

const segredo = 'senhaUltraSecreta';

const jwtconfig = { 
  expiresIn: '1h',
  algorithm: 'HS256', 
};

function generateToken(_id, email, role) {
  const payload = { _id, email, role };
  const token = jwt.sign(payload, segredo, jwtconfig);
  return token;
}

async function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res
    .status(status.unauth).json({ message: authMessages.jwt });
  } 
  try {
    const decoded = jwt.verify(token, segredo);
    const userDB = await userModel.findByEmail(decoded.email);
    if (!userDB) {
      return res
        .status(status.unauth)
        .json({ message: authMessages.jwt });
    }
    req.user = userDB;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/* async function verifyAdmin(req, res, next) {
  const { username } = req.user;
  if (username !== 'admin') {
    return res
    .status(status.forbidden)
    .json({ code: codes.invalidData, message: authMessages.notPermited });
  }
  next();
} */
module.exports = { verifyToken, generateToken /* verifyAdmin */ };
