const serverError = (res, error) => {
  return res
    .status(500)
    .json({ message: `Internal Server Error: ${error.message}` });
};

module.exports = { serverError };
