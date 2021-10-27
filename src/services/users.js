const usersModel = require('../models/users');
const { status, userMessages } = require('../messages');

const create = async (name, email, password) => {
  const checkEmail = await usersModel.findEmail(email);
    if (checkEmail) {
    return { error: { code: status.conflict, message: userMessages.emailNotUnic } };
  }
  const newUser = await usersModel.create(name, email, password);
  return newUser;
};

module.exports = { create };
