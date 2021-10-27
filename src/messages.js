const status = {
  sucess: 200,
  create: 201,
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
  userInvalid: 'Invalid entries. Try again.',
};

const loginMessages = {
  invalidData: 'All fields must be filled',
  incorretLogin: 'Incorret username or password',
};

const authMessages = {
  notPermited: 'You dont have the permission to acess this resource',
  notFoundUser: 'Error on the search for token user',
  tokenNotFound: 'Token not found',
};

module.exports = { status, usersMessages, loginMessages, authMessages };