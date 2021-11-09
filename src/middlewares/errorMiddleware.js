function errorMiddleware(error, _req, res, _next) {
  if (error.status && error.message) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Erro desconhecido, sinto muito.' });
}

module.exports = { errorMiddleware };
