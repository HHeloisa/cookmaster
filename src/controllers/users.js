const rescue = require('express-rescue');
const usersService = require('../services/users');
const { status } = require('../messages');

const createUser = rescue(async (req, res) => {
  
  const { name, email, password } = req.body;
  const { error, createdUser } = await usersService.create(name, password, email);
  if (error) return res.status(error.code).json({ error.message });
  return res.status(status.create).json({ createdUser });

});

module.exports = { createUser };
