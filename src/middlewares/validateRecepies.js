const { status, usersMessages } = require('../messages');

const validRecepies = (req, res, next) => {
  const { name, ingredients, preparation } = req.body;
  
  if (!name || !ingredients || !preparation) {
    return res.status(status.badRequest).json({ message: usersMessages.userInvalid });
  }
  next();
};

module.exports = { validRecepies };
