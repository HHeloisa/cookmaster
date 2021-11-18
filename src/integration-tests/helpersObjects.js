const newUser = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}

const userWithoutName = {
  email: 'hhackenhaar@gmail.com',
  password: '444648'
}
const userWithoutEmail = {
  name: 'Heloísa J. Hackenahar',
  password: '444648'
}
const userWithoutPassW = {
  name: 'Heloísa J. Hackenahar',
  email: 'hhackenhaar@gmail.com',
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

const recipe = {
  name: 'Lasanha vegana',
  ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
  preparation: '2 horas'
}

const recipeWithoutName = {
  ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
  preparation: '2 horas'
}
const recipeWithoutIngredients = {
  name: 'Lasanha vegana',
  preparation: '2 horas'
}
const recipeWithoutPreparation = {
  name: 'Lasanha vegana',
  ingredients: 'Panequeca, Brocolis, Alho, FakeCheddar',
}

module.exports = { newUser, loginWithoutEmail, loginWithoutPassW, incorretLogin, correctLogin,
userWithoutEmail, userWithoutName, userWithoutPassW, recipe, recipeWithoutName, recipeWithoutIngredients,
recipeWithoutPreparation };
