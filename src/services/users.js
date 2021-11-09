const createError = require('http-errors');
const usersModel = require('../models/users');
const { status, usersMessages } = require('../messages');

const create = async (name, password, email) => {
  const checkEmail = await usersModel.findByEmail(email);
  if (checkEmail !== null) {
    throw createError(status.conflict, usersMessages.emailNotUnic);
  }
  const newUser = await usersModel.create(name, email, password);
  return newUser;
};

const createAdmin = async (name, email, password) => {
  const newAdmin = await usersModel.createAdmin(name, email, password);
  return newAdmin;
};

module.exports = { create, createAdmin };
