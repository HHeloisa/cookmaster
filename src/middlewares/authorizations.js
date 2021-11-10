const jwt = require('jsonwebtoken');
const usersModel = require('../models/users');
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

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(status.unauth).json({ message: authMessages.missingToken });
    const decoded = jwt.verify(token, segredo);
    if (!decoded) return res.status(status.unauth).json({ message: authMessages.jwt });
    const userDB = await usersModel.findByEmail(decoded.email);
    req.user = userDB;
    next();
  } catch (error) { return res.status(status.unauth).json({ message: authMessages.jwt }); }
};

module.exports = { verifyToken, generateToken };
