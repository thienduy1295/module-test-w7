const queryValidation = (req, res, next) => {
  try {
    const query = req.query;
    const keysArray = Object.keys(query);
    const allowed = ["page", "city", "company", "rating", "sort", "order"];
    keysArray.forEach((e) => {
      if (allowed.indexOf(e) === -1) {
        const error = new Error(`Query ${e} not allow`);
        error.statusCode = 400;
        throw error;
      }
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = queryValidation;
