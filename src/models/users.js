const connection = require('./connection');

const create = async (nameUser, emailUser, passwordUser) => {
  const db = await connection();
  const newUser = await db.collection('users')
    .insertOne({ name: nameUser, email: emailUser, password: passwordUser, role: 'user' });
  return {
    name: nameUser,
    email: emailUser,
    role: 'user',
    _id: newUser.insertedId,
  };
};

const findByEmail = async (emailUser) => {
  const db = await connection();
  const userDB = await db.collection('users').findOne({ email: emailUser });
  return userDB;
};

module.exports = { create, findByEmail };
