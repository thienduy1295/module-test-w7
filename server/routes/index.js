const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
  // res.send("Welcome to backend server");
});

const companyRoutes = require("./company.js");
router.use("/companies", companyRoutes);

module.exports = router;
