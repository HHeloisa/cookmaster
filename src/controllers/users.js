const rescue = require('express-rescue');
const usersServices = require('../services/users');
const { status } = require('../messages');

const create = rescue(async (req, res) => {
    const { name, email, password } = req.body;
  const { error, newUser } = await usersServices.create(name, password, email);
  console.log('newUserController', newUser);
  if (error) return res.status(error.code).json({ message: error.message });
  return res.status(status.create).json({ user: newUser });
});

module.exports = { create };
