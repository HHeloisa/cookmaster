const rescue = require('express-rescue');
const usersServices = require('../services/users');
const { status } = require('../messages');

const create = rescue(async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await usersServices.create(name, password, email);
  return res.status(status.create).json({ user: newUser });
});

const createAdmin = rescue(async (req, res) => {
  const { name, email, password } = req.body;
  const newAdmin = await usersServices.createAdmin(name, email, password);
  return res.status(status.create).json({ user: newAdmin });
});

module.exports = { create, createAdmin };
