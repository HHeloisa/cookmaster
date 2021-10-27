const { status, usersMessages } = require('../messages');

const validRecepies = (req, res, next) => {
  console.log('to em valid recepies');
  const { name, ingredients, preparation } = req.body;
  console.log(name, ingredients, preparation);
  
  if (!name || !ingredients || !preparation) {
    return res.status(status.badRequest).json({ message: usersMessages.userInvalid });
  }
  next();
};

module.exports = { validRecepies };
