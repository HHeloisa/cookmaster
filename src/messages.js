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
};

module.exports = { status, usersMessages };