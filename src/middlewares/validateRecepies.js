const Joi = require('joi');
const { status, usersMessages } = require('../messages');

const schemaRecipes = Joi.object({
  name: Joi.string().required(),
  ingredients: Joi.string().required(),
  preparation: Joi.string().required(),
});

const validateBodyRecepies = (req, res, next) => {
  const { error } = schemaRecipes.validate(req.body);
  if (error) {
    return res.status(status.badRequest).json({ message: usersMessages.invalidEntries });
  }
  next();
};

module.exports = { validateBodyRecepies };
