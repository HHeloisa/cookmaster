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

module.exports = { validRequireData };
