const { status, usersMessages } = require('../messages');

const verifyAdmin = async (req, res, next) => {
  const { user } = req;
  if (!user.role || user.role !== 'admin') {
    return res.status(status.forbidden).json({ message: usersMessages.onlyAdmin });
  }
  next();
};

module.exports = verifyAdmin;
