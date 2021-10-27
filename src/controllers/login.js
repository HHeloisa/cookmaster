const userModel = require('../models/users');
const { status, loginMessages } = require('../messages');
const { generateToken } = require('../middlewares/authorizations');

async function userLogin(req, res) {
  const { email, password } = req.body;
  const userDB = await userModel.findByEmail(email);
  console.log(userDB);
  const { _id, role } = userDB;
  if (!_id || userDB.password !== password) {
    return res
    .status(status.unauth)
    .json({ message: loginMessages.incorretLogin });
  }

  const token = generateToken(_id, email, role);
  return res.status(status.create).json({ token });
}

module.exports = { userLogin };