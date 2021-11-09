const Joi = require('joi');
const { status, loginMessages } = require('../messages');

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const validRequireData = (req, res, next) => {
  const { error } = schemaLogin.validate(req.body);
  if (error) {
    return res.status(status.unauth).json({ message: loginMessages.invalidData });
  } 
  next();
};

module.exports = { validRequireData };
