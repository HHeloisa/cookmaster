const userModel = require('../models/users');
const { status, loginMessages } = require('../messages');
const { generateToken } = require('../middlewares/authorizations');

async function userLogin(req, res) {
  const { email, password } = req.body;
  const userDB = await userModel.findByEmail(email);
  console.log(userDB);
  if (!userDB || userDB.password !== password) {
    return res
    .status(status.unauth)
    .json({ message: loginMessages.incorretLogin });
  }
  const { _id, role } = userDB;
  
  const token = generateToken(_id, email, role);
  return res.status(status.sucess).json({ token });
}

module.exports = { userLogin };