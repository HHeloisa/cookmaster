const status = {
  sucess: 200,
  create: 201,
  noContent: 204,
  badRequest: 400,
  unauth: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  unprocessableEntity: 422,
  intServerError: 500,
};

const usersMessages = {
  emailNotUnic: 'Email already registered',
  invalidEntries: 'Invalid entries. Try again.',
  onlyAdmin: 'Only admins can register new admins',
};

const loginMessages = {
  invalidData: 'All fields must be filled',
  incorretLogin: 'Incorrect username or password',
};

const authMessages = {
  jwt: 'jwt malformed',
  missingToken: 'missing auth token',
};

const recipesMessages = { 
  notFound: 'recipe not found',
};

const otherMessage = {
  unknown: 'Erro desconhecido, sinto muito.',
};

module.exports = { 
  status, usersMessages, loginMessages, authMessages, recipesMessages, otherMessage };
