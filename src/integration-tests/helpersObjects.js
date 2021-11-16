const newUser = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

const loginWithoutEmail = {
  password: '444648'
}

const loginWithoutPassW = {
  email: 'hhackenhaar@gmail.com',
}

const incorretLogin = {
  email: 'lalackenhaar@gmail.com',
  password: '444648'
}

const correctLogin = { 
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

module.exports = { newUser, loginWithoutEmail, loginWithoutPassW, incorretLogin, correctLogin };
