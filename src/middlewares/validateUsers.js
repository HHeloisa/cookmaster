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

module.exports = { validRequireData };
