// const validateAdmin = require('./validateRecepies');
const Joi = require('joi');
const { status, usersMessages } = require('../messages');

const schemaUsers = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validRequireData = (req, res, next) => {
  const { error } = schemaUsers.validate(req.body);
  if (error) {
    return res.status(status.badRequest).json({ message: usersMessages.invalidEntries });
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
