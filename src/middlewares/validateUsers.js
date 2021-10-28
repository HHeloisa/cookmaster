// const validateAdmin = require('./validateRecepies');
const { status, usersMessages } = require('../messages');

const validRequireData = (req, res, next) => {
  const { name, email, password } = req.body;
  const regexEmail = /\S+@\S+\.\S+/;
  const validEmail = regexEmail.test(email);
  if (!name || !email || !password || !validEmail) {
    return res.status(status.badRequest).json({ message: usersMessages.userInvalid });
  } 
  next();
};
const validateAdmin = (role) => {
  if (role !== 'admin') return false;
  return true;
};

const validAdmin = (req, res, next) => {
  console.log('validAdmin');
  const { role } = req.user;
  console.log(role);
  const isAdmin = validateAdmin(role);
  console.log(isAdmin);
  if (isAdmin === false) {
    return res.status(status.forbidden).json({ message: usersMessages.onlyAdmin });
  }
  next();
};

module.exports = { validRequireData, validAdmin };
