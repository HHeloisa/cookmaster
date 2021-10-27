const rescue = require('express-rescue');
const recepiesService = require('../services/recepies');
const { status } = require('../messages');

const create = rescue(async (req, res) => {
  const { name, ingredients, preparation } = req.body;
  const { _id } = req.user;

  const newRecepie = await recepiesService.create(name, ingredients, preparation, _id);
  return res.status(status.create).json(newRecepie);
});

module.exports = { create };