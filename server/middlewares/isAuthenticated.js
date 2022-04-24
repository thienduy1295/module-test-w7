const isAuthenticated = (req, res, next) => {
  const { accesstoken } = req.headers;
  try {
    if (!accesstoken || accesstoken !== "123") {
      throw new Error("Please login");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthenticated;
