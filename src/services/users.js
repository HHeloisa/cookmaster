const usersModel = require('../models/users');
const { status, usersMessages } = require('../messages');

const create = async (name, password, email) => {
  const checkEmail = await usersModel.findByEmail(email);
    if (checkEmail !== null) {
    return { error: { code: status.conflict, message: usersMessages.emailNotUnic } };
  }
  const newUser = await usersModel.create(name, email, password);
  return { newUser };
};

module.exports = { create };
