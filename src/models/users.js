const connection = require('./connection');

const create = async (name, email, password) => {
  const db = await connection();
  const newUser = await db.collection('users').insertOne({ name, email, password, role: 'user' });
  return { name, email, role: 'user', _id: newUser.insertedId };
};

module.exports = { create };