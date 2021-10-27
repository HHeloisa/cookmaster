const { status, loginMessages } = require('../messages');

const validRequireData = (req, res, next) => {
  const { email, password } = req.body;
  const regexEmail = /\S+@\S+\.\S+/;
  const validEmail = regexEmail.test(email);
  if (!email || !password || !validEmail) {
    return res.status(status.unauth).json({ message: loginMessages.invalidData });
  } 
  next();
};

module.exports = { validRequireData };
